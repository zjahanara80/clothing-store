const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const authenticateToken = require('../middleware/authenticateToken');
const multer = require('multer');
const path = require('path');
const Category = require('../models/Category'); 

// article cover file uploader setting
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/articles/'),
  filename: (req, file, cb) => {
    const uniqueName = 'cover-' + Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});
const upload = multer({ storage });


//create article (draft or published)
router.post('/', authenticateToken, upload.single('cover'), async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ error: 'دسترسی غیرمجاز' });

    const { title, body, chekide ,link, category, isDraft } = req.body;
    const cover = req.file ? `/uploads/articles/${req.file.filename}` : '';

    let categoryData;
    if (category === '-1') {
      categoryData = 'متفرقه';
    } else {
      // search for category from DB
      categoryData = await Category.findById(category);
      if (!categoryData) {
        return res.status(404).json({ error: 'دسته‌بندی یافت نشد' });
      }
    }

    const newArticle = new Article({
      title,
      body,
      chekide,
      slug : link,
      category : categoryData,
      cover,
      isDraft: isDraft === 'true' 
    });

    await newArticle.save();
    res.status(201).json(
      {article: newArticle , 
        message: 'مقاله ایجاد شد',
        article: newArticle}
      
    );
  } catch (err) {
    res.status(500).json({ error: 'خطا در ایجاد مقاله' });
  }
});


// get all articles (published)
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find({ isDraft: false });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: 'خطا در دریافت مقالات' });
  }
});

//get all Articles with filterability by draft for Admin 
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ error: 'دسترسی غیرمجاز' });

    const { draft } = req.query;
    let filter = {};

    if (draft == 'true') {
      filter.isDraft = true;
    } else if (draft == 'false') {
      filter.isDraft = false;
    }

    const articles = await Article.find(filter);
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: 'خطا در دریافت مقالات برای ادمین' });
  }
});


//get single article
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article || article.isDraft) return res.status(404).json({ error: 'یافت نشد' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: 'خطا در دریافت مقاله' });
  }
});


//remove article
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ error: 'دسترسی غیرمجاز' });

    const deleted = await Article.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'مقاله یافت نشد' });

    res.json({ message: 'مقاله حذف شد' });
  } catch (err) {
    res.status(500).json({ error: 'خطا در حذف مقاله' });
  }
});


//create draft article
router.post(
    '/draft',
    authenticateToken,
    upload.single('cover'),
    async (req, res) => {
      try {
        if (!req.user.isAdmin) {
          return res.status(403).json({ error: 'فقط مدیر مجاز است' });
        }
  
        const { title, body,chekide, link, category } = req.body;
        const cover = req.file ? `/uploads/articles/${req.file.filename}` : '';
  
        const newArticle = new Article({
          title,
          body,
          chekide,
          slug : link,
          category,
          cover,
          isDraft: true  // این مهمه
        });
  
        await newArticle.save();
        res.status(201).json({ message: 'پیش‌نویس مقاله با موفقیت ذخیره شد', article: newArticle });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'خطا در ایجاد پیش‌نویس' });
      }
    }
  );


router.put('/:id', authenticateToken, upload.single('cover'), async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ error: 'دسترسی غیرمجاز' });

    const { title, body, chekide, slug, category, relatedProduct, isDraft } = req.body;
    const cover = req.file ? `/uploads/articles/${req.file.filename}` : undefined;

    let categoryData;
    if (category === '-1') {
      categoryData = 'متفرقه';
    } else {
      categoryData = await Category.findById(category);
      if (!categoryData) return res.status(404).json({ error: 'دسته‌بندی یافت نشد' });
    }

    const updatedData = {
      title,
      body,
      chekide,
      slug,
      category: categoryData,
      relatedProduct: category === 'product' ? relatedProduct : null,
      isDraft: isDraft === 'true'
    };

    if (cover) updatedData.cover = cover;

    const updated = await Article.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updated) return res.status(404).json({ error: 'مقاله یافت نشد' });

    res.json({ message: 'مقاله بروزرسانی شد', article: updated });
  } catch (err) {
    res.status(500).json({ error: 'خطا در بروزرسانی مقاله' });
  }
});

// publish the draft article
router.put(
    '/:id/publish',
    authenticateToken,
    async (req, res) => {
      try {
        if (!req.user.isAdmin) {
          return res.status(403).json({ error: 'فقط مدیر مجاز است' });
        }
  
        const article = await Article.findById(req.params.id);
        if (!article) {
          return res.status(404).json({ error: 'مقاله یافت نشد' });
        }
  
        article.isDraft = false;
        await article.save();
  
        res.json({ message: 'مقاله با موفقیت منتشر شد', article });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'خطا در انتشار مقاله' });
      }
    }
  );
  
module.exports = router;
