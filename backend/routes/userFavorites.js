const Product = require('../models/Product');

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authenticateToken = require('../middleware/authenticateToken');
const User = require('../models/User');
const Campaign = require('../models/Campaign');

router.post('/favorites/toggle/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'شناسه محصول نامعتبر است.' });
    }

    // چک کردن کاربر
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد.' });
    }

    // چک کردن محصول
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'محصول یافت نشد.' });
    }

    const index = user.favoriteProducts.findIndex(id => id.toString() === productId);
    let isFavorite;
    if (index === -1) {
      user.favoriteProducts.push(productId);
      isFavorite = true;
    } else {
      user.favoriteProducts.splice(index, 1);
      isFavorite = false;
    }

    await user.save();

    res.json({ success: true, isFavorite });
  } catch (err) {
    console.error("Error in toggle favorite:", err);
    res.status(500).json({ message: 'خطای سرور در تغییر علاقه‌مندی.', error: err.message });
  }
});


// حذف از علاقه‌مندی‌ها (اختیاری اگر فقط toggle استفاده شود)
router.delete('/favorites/:productId', authenticateToken, async (req, res) => {
  const { productId } = req.params;

  const user = await User.findById(req.user.id);
  user.favoriteProducts = user.favoriteProducts.filter(id => id.toString() !== productId);
  await user.save();

  res.json({ favorites: user.favoriteProducts });
});

// دریافت لیست علاقه‌مندی‌ها
// router.get('/favorites', authenticateToken, async (req, res) => {
//   const user = await User.findById(req.user.id).populate('favoriteProducts');
//   res.json({ favorites: user.favoriteProducts });
// });

// router.get('/favorites', authenticateToken, async (req, res) => {
//   const user = await User.findById(req.user.id).populate('favoriteProducts');
  
//   // بررسی کمپین‌ها برای هر محصول
//   const favoritesWithGlobal = await Promise.all(
//     user.favoriteProducts.map(async (product) => {
//       const campaign = await Campaign.findOne({
//         product: product._id,
//         startDate: { $lte: new Date() },
//         endDate: { $gte: new Date() }
//       });

//       const obj = product.toObject();
//       obj.globalDiscount = campaign ? campaign.discount : 0;
//       return obj;
//     })
//   );

//   res.json({ favorites: favoritesWithGlobal });
// });

router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favoriteProducts');
    if (!user) return res.status(404).json({ message: 'کاربر یافت نشد' });

    const now = new Date();
    const globalCampaign = await Campaign.findOne({
      isGlobal: true,
      isActive: true,
      $or: [
        { startDate: { $lte: now }, endDate: { $gte: now } },
        { startDate: null, endDate: null }
      ]
    });

    const favoritesWithGlobal = user.favoriteProducts.map(product => ({
      ...product.toObject(),
      globalDiscount: globalCampaign ? globalCampaign.discountPercent : 0
    }));

    res.json({ favorites: favoritesWithGlobal });
  } catch (err) {
    console.error("Error in get favorites:", err);
    res.status(500).json({ message: 'خطای سرور در دریافت علاقه‌مندی‌ها.' });
  }
});



module.exports = router;

