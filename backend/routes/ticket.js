const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const authenticateToken = require('../middleware/authenticateToken');
const ticketController = require('../controllers/ticketController');


router.post('/', async (req, res) => {
  try {
    const { email, name, message, title } = req.body;

    if (!email || !message || !name || !title) {
      return res.status(400).json({ error: 'ایمیل، پیام، نام و عنوان الزامی هستند' });
    }

    const user = await User.findOne({ email });
    const userExists = !!user;

    const ticket = await Ticket.create({ email, name, message, title, user: user?._id || undefined, userExists });

    res.status(201).json({
      ticketId: ticket._id,
      userExists,
      message: 'تیکت با موفقیت ثبت شد'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در ثبت تیکت' });
  }
  const allUsers = await User.find();
  console.log("📋 All users:", allUsers.map(u => u.email));
});

// مدیریت: دریافت همه تیکت‌ها
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ error: 'دسترسی غیرمجاز' });

    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'خطا در دریافت تیکت‌ها' });
  }
});

// دریافت تیکت‌های کاربر لاگین شده
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const tickets = await Ticket.find({ user: userId, parent: null }).sort({ createdAt: -1 });

    const ticketsWithAnswers = await Promise.all(
      tickets.map(async (ticket) => {
        const answers = await Ticket.find({ parent: ticket._id }).sort({ createdAt: 1 });
        return {
          ...ticket.toObject(),
          answers
        };
      })
    );

    res.json(ticketsWithAnswers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطا در دریافت تیکت‌های کاربر' });
  }
});


// مدیریت: پاسخ یا رد یا دیدن تیکت
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ error: 'دسترسی غیرمجاز' });

    const { status, reply, seen } = req.body;
    const updated = await Ticket.findByIdAndUpdate(
      req.params.id,
      { $set: { status, reply, seen } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'تیکت پیدا نشد' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'خطا در بروزرسانی تیکت' });
  }
});

router.post('/answer', authenticateToken, ticketController.setAnswer);

router.delete('/:id', authenticateToken, ticketController.deleteTicket)

module.exports = router;
