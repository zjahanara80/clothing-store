
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
    
  console.log('Authorization header:', authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
  } catch (err) {
    req.user = null;
  }

  next();
};

module.exports = optionalAuth;
