
const Product = require('../models/Product');
const mongoose = require('mongoose');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const fs = require("fs");
const path = require("path");

exports.createProduct = async (req, res) => {
  try {

    const product = await Product.create(req.body);
    res.status(201).json(product);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.createProduct = async (req, res) => {
//   try {
//     const productData = {
//       ...req.body,
//       discount: req.body.discount !== undefined ? Number(req.body.discount) : 0, 
//       price: Number(req.body.price),
//       countInStock: Number(req.body.countInStock),
//       size: req.body.size
//         ? Array.isArray(req.body.size)
//           ? req.body.size
//           : req.body.size.split(",").map(s => s.trim())
//         : [],
//       code: req.body.code
//         ? Array.isArray(req.body.code)
//           ? req.body.code
//           : [req.body.code]
//         : [],
//       img: req.files && req.files.length > 0
//         ? req.files.map(file => `/uploads/products/${file.filename}`)
//         : []
//     };

//     const product = await Product.create(productData);
//     res.status(201).json(product);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'عبارت جستجو ارسال نشده است.' });
    }
    const searchRegex = new RegExp(query, 'i');
    const isNumeric = !isNaN(query);
    const filter = { $or: [{ name: searchRegex }] };
    if (isNumeric) filter.$or.push({ code: parseInt(query) });

    const products = await Product.find(filter).populate('category');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'خطا در جستجوی محصولات' });
  }
};


exports.getProducts = async (req, res) => {
  console.log('REQ.USER:', req.user);
  try {
    const filters = {};

    // بررسی وجود category در query
    if (req.query.category) {
      const categoryIds = req.query.category
        .split(',')
        .filter(id => mongoose.Types.ObjectId.isValid(id));

      if (categoryIds.length > 0) {
        filters.category = { $in: categoryIds.map(id => new mongoose.Types.ObjectId(id)) };
      }
    }

    // دریافت محصولات طبق فیلتر
    const products = await Product.find(filters).populate('category');

    // دریافت جدیدترین علاقه‌مندی‌های کاربر از دیتابیس
    let favoriteIds = [];
        let cartIds = [];
    if (req.user) {
      const userFromDb = await User.findById(req.user.id);
      if (userFromDb) {
        favoriteIds = userFromDb.favoriteProducts.map(id => id.toString());
        cartIds = userFromDb.cartProducts.map(id => id.toString());

      }
    }

    // بررسی کمپین فعال
    const activeCampaign = await Campaign.findOne({ isActive: true });

    const productsWithEnhancements = products.map(p => {
      const pObj = p.toObject();

      // تعیین وضعیت علاقه‌مندی
      pObj.isFavorite = favoriteIds.includes(p._id.toString());

      pObj.inCart = cartIds.includes(p._id.toString());

      // محاسبه قیمت نهایی با تخفیف محصول یا کمپین
      if (pObj.discount > 0) {
        const discountAmount = (pObj.price * pObj.discount) / 100;
        pObj.finalPrice = Math.floor(pObj.price - discountAmount);
        pObj.globalDiscount = 0;
      } else if (activeCampaign) {
        const discountAmount = (pObj.price * activeCampaign.discountPercent) / 100;
        pObj.finalPrice = Math.floor(pObj.price - discountAmount);
        pObj.globalDiscount = activeCampaign.discountPercent;
      } else {
        pObj.finalPrice = pObj.price;
        pObj.globalDiscount = 0;
      }

      return pObj;
    });

    // مرتب‌سازی: تخفیف ویژه > تخفیف کمپین > بدون تخفیف
    productsWithEnhancements.sort((a, b) => {
      const getPriority = (p) => {
        if (p.discount > 0) return 2;
        if (p.globalDiscount > 0) return 1;
        return 0;
      };
      return getPriority(b) - getPriority(a);
    });

    res.json(productsWithEnhancements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در دریافت محصولات' });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'شناسه محصول نامعتبر است.' });
    }

    const product = await Product.findById(id).populate('category');
    if (!product) {
      return res.status(404).json({ error: 'محصولی با این شناسه یافت نشد.' });
    }

    let isFav = false;
    if (req.user) {
      const user = await User.findById(req.user.id);
      if (user) {
        isFav = user.favoriteProducts.some(favId => favId.toString() === id);
      }
    }

    const productObj = product.toObject();
    productObj.isFavorite = isFav;

    const activeCampaign = await Campaign.findOne({ isActive: true });

    if (productObj.discount > 0) {
      const discountAmount = (productObj.price * productObj.discount) / 100;
      productObj.finalPrice = Math.floor(productObj.price - discountAmount);
      productObj.globalDiscount = 0;
    }
    else if (activeCampaign) {
      const discountAmount = (productObj.price * activeCampaign.discountPercent) / 100;
      productObj.finalPrice = Math.floor(productObj.price - discountAmount);
      productObj.globalDiscount = activeCampaign.discountPercent;
    }
    else {
      productObj.finalPrice = productObj.price;
      productObj.globalDiscount = 0;
    }

    res.json(productObj);
  } catch (err) {
    res.status(500).json({ error: 'خطا در دریافت محصول' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'محصولی با این شناسه یافت نشد.' });
    }
    res.status(200).json({ message: 'محصول با موفقیت حذف شد.', deletedProduct });
  } catch (err) {
    console.error('خطا در حذف محصول:', err);
    res.status(500).json({ message: 'خطای سرور در حذف محصول.' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "محصول پیدا نشد" });

    if (req.body.removeImages) {
      const removeImages = Array.isArray(req.body.removeImages)
        ? req.body.removeImages
        : [req.body.removeImages];

      removeImages.forEach(img => {
        const fullPath = path.join(__dirname, "..", img);
        fs.unlink(fullPath, (err) => { if (err) console.error("خطا در حذف فایل:", err); });
      });

      product.img = product.img.filter(i => !removeImages.includes(i));
    }

    const updateData = {};

    // متن‌ها
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.category) updateData.category = req.body.category;
    if (req.body.code) updateData.code = Array.isArray(req.body.code) ? req.body.code : [req.body.code];

    // عددها
    if (req.body.price !== undefined) updateData.price = Number(req.body.price);
    if (req.body.countInStock !== undefined) updateData.countInStock = Number(req.body.countInStock);

    // سایزها
    if (req.body.size) {
      updateData.size = typeof req.body.size === "string"
        ? req.body.size.split(",").map(s => s.trim())
        : req.body.size;
    }

    // تخفیف محصول → اگر ارسال نشده دست نخورده بمونه، اگر ارسال شده 0 یا مقدار خودش اعمال بشه
    if (req.body.discount !== undefined) {
      updateData.discount = Number(req.body.discount);
    }

    // تصاویر
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map(file => `/uploads/products/${file.filename}`);
      updateData.img = [...product.img, ...imagePaths];
    } else {
      updateData.img = product.img;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    if (!updatedProduct) return res.status(404).json({ error: "محصول یافت نشد." });

    res.json({ message: "محصول با موفقیت ویرایش شد", product: updatedProduct });
  } catch (err) {
    console.error("خطا در ویرایش محصول:", err);
    res.status(500).json({ error: "خطا در ویرایش محصول" });
  }
};

