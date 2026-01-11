
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticateToken = require('../middleware/authenticateToken');
const isAdmin = require('../middleware/isAdmin');
const { deleteUser, toggleBanUser, createUser , updateUserByAdmin,updateMe } = require('../controllers/userController');
const bcrypt = require('bcryptjs');


// create user (admin only)
router.post('/', authenticateToken, isAdmin, createUser);

//authenticate
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'کاربر یافت نشد' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// admin: get user by ID
router.get('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'کاربر یافت نشد' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'خطا در دریافت کاربر' });
  }
});


router.patch('/me', authenticateToken, async (req, res) => {
  try {
    const updates = {};
    const allowed = ['name', 'username', 'email', 'phone', 'password'];

    for (const field of allowed) {
      const v = req.body[field];
      if (typeof v === 'string' && v.trim() !== '') updates[field] = v.trim();
    }

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, select: '-password' }
    );

    res.json({ message: 'اطلاعات با موفقیت به‌روز شدند', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// list & latest (admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'خطا در دریافت کاربران' });
  }
});

router.get('/latest', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 }).limit(5);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'خطا در دریافت کاربران اخیر' });
  }
});

// actions on other users (admin only)
router.patch('/ban/:id', authenticateToken, isAdmin, toggleBanUser);
router.delete('/:id', authenticateToken, isAdmin, deleteUser);

//admin: edit user
router.patch('/admin/:id', authenticateToken, updateUserByAdmin);

//edit user by self
router.patch('/me', authenticateToken, updateMe);

module.exports = router;
