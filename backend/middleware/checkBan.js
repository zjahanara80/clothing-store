// middleware/checkBan.js
const User = require('../models/User');

async function checkBanStatus(req, res, next) {
  const { phone, email } = req.body;
  console.log('به middleware رسیدیم:', { phone, email }); // خط دیباگ

  if (!phone && !email) {
    return next();
  }

  try {
    const user = await User.findOne({
      $or: [
        phone ? { phone } : null,
        email ? { email } : null
      ].filter(Boolean)
    });

    if (user && user.isBanned) {
      return res.status(403).json({
        error: 'شما بن شده‌اید؛ امکان استفاده از این حساب یا شماره وجود ندارد.'
      });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطا در بررسی وضعیت بن' });
  }
}

module.exports = checkBanStatus;
