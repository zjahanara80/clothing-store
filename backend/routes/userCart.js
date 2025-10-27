
// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');
// const authenticateToken = require('../middleware/authenticateToken');
// const User = require('../models/User');
// const Product = require('../models/Product');
// const Campaign = require('../models/Campaign');
// const cartController = require('../controllers/cartController');

// // اضافه/حذف محصول از سبد خرید
// router.post('/toggle/:productId', authenticateToken, async (req, res) => {
//   try {
//     const { productId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(productId))
//       return res.status(400).json({ message: 'شناسه محصول نامعتبر است.' });

//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: 'کاربر یافت نشد.' });

//     // const productIndex = user.cartProducts.findIndex(id => id.toString() === productId);
//     const productIndex = user.cartProducts.findIndex(item => item.product._id.toString() === productId);
//     let inCart;
//     if (productIndex === -1) {
//       user.cartProducts.push(productId);
//       inCart = true;
//     } else {
//       user.cartProducts.splice(productIndex, 1);
//       inCart = false;
//     }

//     await user.save();
//     res.json({ success: true, inCart });
//   } catch (err) {
//     console.error("Error in toggle cart:", err);
//     res.status(500).json({ message: 'خطای سرور در تغییر سبد خرید.', error: err.message });
//   }
// });


// router.post('/update-quantity', authenticateToken, cartController.updateQuantity);

// // دریافت محصولات سبد خرید
// router.get('/', authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).populate('cartProducts');
//     if (!user) return res.status(404).json({ message: 'کاربر یافت نشد' });

//     const now = new Date();
//     const globalCampaign = await Campaign.findOne({
//       isGlobal: true,
//       isActive: true,
//       $or: [
//         { startDate: { $lte: now }, endDate: { $gte: now } },
//         { startDate: null, endDate: null }
//       ]
//     });

//     const cartWithGlobal = user.cartProducts.map(product => {
//       const pObj = product.toObject();

//       // محاسبه قیمت نهایی با تخفیف
//       if (pObj.discount > 0) {
//         const discountAmount = (pObj.price * pObj.discount) / 100;
//         pObj.finalPrice = Math.floor(pObj.price - discountAmount);
//         pObj.globalDiscount = 0;
//       } else if (globalCampaign) {
//         const discountAmount = (pObj.price * globalCampaign.discountPercent) / 100;
//         pObj.finalPrice = Math.floor(pObj.price - discountAmount);
//         pObj.globalDiscount = globalCampaign.discountPercent;
//       } else {
//         pObj.finalPrice = pObj.price;
//         pObj.globalDiscount = 0;
//       }

//       return pObj;
//     });
//     res.json({ cart: cartWithGlobal.map(p => ({ ...p, inCart: true })) });
//   } catch (err) {
//     console.error("Error in get cart:", err);
//     res.status(500).json({ message: 'خطای سرور در دریافت سبد خرید.' });
//   }
// });


// router.post('/remove', authenticateToken, cartController.removeFromCart);
// module.exports = router;


const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authenticateToken = require('../middleware/authenticateToken');
const cartController = require('../controllers/cartController');

// افزودن یا حذف محصول (toggle)
router.post('/toggle/:productId', authenticateToken, cartController.toggleProduct);

// افزودن محصول به سبد خرید یا افزایش تعداد
router.post('/add', authenticateToken, cartController.addToCart);

// بروزرسانی تعداد محصول
router.post('/update-quantity', authenticateToken, cartController.updateQuantity);

// حذف محصول از سبد خرید
router.post('/remove', authenticateToken, cartController.removeFromCart);

// دریافت سبد خرید
router.get('/', authenticateToken, cartController.getCart);

module.exports = router;
