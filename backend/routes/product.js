const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authenticateToken = require('../middleware/authenticateToken'); // بررسی توکن
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');
const optionalAuth = require('../middleware/optionalAuth');
const isAdmin = require('../middleware/isAdmin');
const { updateProduct } = require("../controllers/productController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

router.get('/search', optionalAuth, productController.searchProducts);
router.get('/', optionalAuth, productController.getProducts);
router.get('/:id', optionalAuth, productController.getProductById);

router.post(
  '/',
  authenticateToken,
  upload.array('img', 5),
  async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'دسترسی غیرمجاز' });
      }

      const { name, description, price, countInStock, category, size, code, discount } = req.body;

      const existingProduct = await Product.findOne({ code: req.body.code });
      if (existingProduct) {
        return res.status(400).json({
          field: "code",
          message: "این کد محصول قبلا استفاده شده است."
        });
      }

      const imagePaths = req.files.map(file => `/uploads/products/${file.filename}`);

      const newProduct = new Product({
        name,
        description,
        price,
        countInStock,
        category,
        size: Array.isArray(size) ? size : [size],
        code,
        img: imagePaths,
        discount: discount !== undefined ? Number(discount) : 0,
      });

      await newProduct.save();
      res.status(201).json({ message: 'محصول با موفقیت اضافه شد', product: newProduct });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'خطا در افزودن محصول' });
    }
  }
);

//edit product(add photo for product)
router.patch(
  "/:id",
  authenticateToken,
  isAdmin,
  upload.array("img", 5),
  //حداکثر 5 تا عکس
  updateProduct
);

//delete photo 
router.delete("/:id/images", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { image } = req.body
    const product = await Product.findById(req.params.id)

    if (!product) return res.status(404).json({ message: "محصول پیدا نشد" })

    // delete photo from array
    product.img = product.img.filter(img => img !== image)
    await product.save()

    res.json({ message: "عکس حذف شد", product })
  } catch (err) {
    res.status(500).json({ message: "خطا در حذف عکس" })
  }
})
router.delete('/:id', authenticateToken, productController.deleteProduct);
module.exports = router;