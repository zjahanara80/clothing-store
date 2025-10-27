const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const CommentArticle = require('../models/CommentArticle');

// 🔹 ثبت کامنت جدید برای مقاله
router.post('/', async (req, res) => {
  const { articleId, name, email, title, message, rating } = req.body;

  if (!articleId || !name || !email || !title || !message || rating == null) {
    return res.status(400).json({ error: 'تمام فیلدها الزامی هستند!' });
  }

  let isVerified = false;
  let userRef = null;

  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userRef = decoded.id;
      isVerified = true;
    } catch (err) {
      console.error('خطا در اعتبارسنجی توکن:', err.message);
    }
  }

  try {
    const comment = await CommentArticle.create({
      article: articleId,
      user: userRef,
      name,
      email,
      title,
      message,
      rating,
      isVerifiedUser: isVerified,
    });

    res.status(201).json({ message: 'کامنت ثبت شد', comment });
  } catch (err) {
    res.status(500).json({ message: 'خطا در ثبت کامنت', error: err });
  }
});

// 🔹 دریافت همه کامنت‌های یک مقاله خاص
router.get('/:articleId', async (req, res) => {
  try {
    const comments = await CommentArticle.find({
       article: req.params.articleId,
       approved: true 
      })
      .sort({ createdAt: -1 })
      .lean();

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'خطا در دریافت کامنت‌های مقاله', error: err });
  }
});

// 🔹 دریافت تمام کامنت‌ها (برای مدیر)
router.get('/', async (req, res) => {
  try {
    const comments = await CommentArticle.find()
      .sort({ createdAt: -1 })
      .populate('article', 'title') // فقط عنوان مقاله
      .lean();

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'خطا در دریافت کامنت‌ها' });
  }
});

// 🔹 تأیید کامنت
router.patch('/approve/:id', async (req, res) => {
  try {
    const comment = await CommentArticle.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ message: 'کامنت یافت نشد' });
    }

    res.json({ message: 'کامنت تأیید شد', comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطا در تأیید کامنت', error: err });
  }
});

// 🔹 رد کامنت
router.patch('/reject/:id', async (req, res) => {
  try {
    const comment = await CommentArticle.findByIdAndUpdate(
      req.params.id,
      { approved: false },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ message: 'کامنت یافت نشد' });
    }

    res.json({ message: 'کامنت رد شد', comment });
  } catch (error) {
    res.status(500).json({ message: 'خطا در رد کامنت', error });
  }
});

// 🔹 حذف کامنت
router.delete('/:id', async (req, res) => {
  try {
    const deletedComment = await CommentArticle.findByIdAndDelete(req.params.id);

    if (!deletedComment) {
      return res.status(404).json({ message: 'کامنت مورد نظر پیدا نشد' });
    }

    res.json({ message: 'کامنت با موفقیت حذف شد', deletedComment });
  } catch (error) {
    res.status(500).json({ message: 'خطا در حذف کامنت', error });
  }
});

module.exports = router;
