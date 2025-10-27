
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // اصلاح این خط
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user; // بهتر از فقط decoded
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};



// module.exports = async (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'No token provided' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.userId).select('-password');
//     if (!user) return res.status(401).json({ message: 'User not found' });

//     req.user = decoded; // حالا req.user اطلاعات کامل کاربر را دارد
//     next();
//   } catch (err) {
//     res.status(403).json({ message: 'Invalid token' });
//   }
// };
