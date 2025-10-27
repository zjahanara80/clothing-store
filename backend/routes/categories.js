
const categoryController = require('../controllers/categoryController');

const authenticateToken = require('../middleware/authenticateToken'); // بررسی توکن


// routes/category.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');


const multer = require('multer');
const path = require('path');


const menuStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/menus/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const uploadMenuImage = multer({ storage: menuStorage });

router.get('/with-children', async (req, res) => {
  try {
    const categories = await Category.find();

    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat._id] = { ...cat._doc, children: [] };
    });

    const tree = [];
    categories.forEach(cat => {
      if (cat.parent) {
        const parentId = cat.parent.toString();
        if (categoryMap[parentId]) {
          categoryMap[parentId].children.push(categoryMap[cat._id]);
        }
      } else {
        tree.push(categoryMap[cat._id]);
      }
    });

    res.json(tree);
  } catch (err) {
    res.status(500).json({ error: 'خطا در دریافت دسته‌بندی‌ها' });
  }
});

//  دریافت فقط منوهای اصلی (parent == null)
router.get('/parents', async (req, res) => {
  try {
    const parents = await Category.find({ parent: null });
    res.json(parents);
  } catch (err) {
    res.status(500).json({ error: 'خطا در دریافت منوهای اصلی' });
  }
});


//  دریافت همه دسته‌بندی‌ها بدون ساختار درختی
router.get('/', async (req, res) => {
  try {
    const all = await Category.find().populate('parent');
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: 'خطا در دریافت همه دسته‌بندی‌ها' });
  }
});


router.post(
  '/',
  authenticateToken,
  uploadMenuImage.single('background'),
  categoryController.createCategoryWithImage
);


router.delete('/:id', authenticateToken, async (req, res) => {
  try {

    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'دسترسی غیرمجاز' });
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'منو پیدا نشد' });
    }

    res.status(200).json({ message: 'منو با موفقیت حذف شد' });
  } catch (err) {
    res.status(500).json({ error: 'خطا در حذف منو' });
  }
});

router.patch(
  '/:id',
  authenticateToken,
  uploadMenuImage.single('background'), // برای آپلود تصویر در صورت تغییر
  categoryController.updateCategory
);

//  دریافت یک دسته‌بندی با آی‌دی
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('parent');
    if (!category) {
      return res.status(404).json({ error: 'دسته‌بندی پیدا نشد' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'خطا در دریافت دسته‌بندی' });
  }
});

module.exports = router;
