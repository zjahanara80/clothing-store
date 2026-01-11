const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const jwt = require('jsonwebtoken');

//insert comment
router.post('/', async (req, res) => {
  const { productId, name, email, title, message, rating } = req.body;
  if (!productId || !name || !email || !title || !message || rating == null) {
    return res.status(400).json({ error: 'تمام فیلدها الزامی هستند!' });
  }

  let isVerified = false;
  let userRef = null;
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      isVerified = true;
      userRef = decoded.id;
    } catch {}
  }

  const comment = await Comment.create({
    product: productId,
    user: userRef,
    name, email, title, message, rating,
    isVerifiedUser: isVerified
  });
  res.status(201).json({ message: 'کامنت ثبت شد', comment });
});


router.get('/:productId', async (req, res) => {
  try {
    const comments = await Comment.find({ 
      product: req.params.productId, 
      approved: true 
    }).sort({ createdAt: -1 }).lean();
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت کامنت‌ها', error });
  }
});

router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find({ 
    })
    .populate('product', 'name price img') 
    .sort({ createdAt: -1 })
    .lean();

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت کامنت‌ها', error });
  }
});


router.patch('/approve/:id', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    res.json({ message: 'کامنت تأیید شد', comment });
  } catch (error) {
    res.status(500).json({ message: 'خطا در تأیید کامنت', error });
  }
});

router.patch('/reject/:id', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { approved: false },
      { new: true }
    );
    res.json({ message: 'کامنت رد شد', comment });
  } catch (error) {
    res.status(500).json({ message: 'خطا در رد کامنت', error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);
    if (!deletedComment) {
      return res.status(404).json({ message: 'کامنت مورد نظر پیدا نشد' });
    }
    res.json({ message: 'کامنت با موفقیت حذف شد', deletedComment });
  } catch (error) {
    res.status(500).json({ message: 'خطا در حذف کامنت', error });
  }
});

module.exports = router;
