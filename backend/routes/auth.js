// routes/authRoutes.js
const express = require('express');
const router = express.Router();

const {
  register: registerUser,
  login: loginUser,
  getMe
} = require('../controllers/authController');

const authenticateToken = require('../middleware/authenticateToken');
const checkBanStatus = require('../middleware/checkBan');

router.post('/login',
  checkBanStatus,
  async (req, res, next) => {
    try {
      await loginUser(req, res);
    } catch (err) {
      next(err);
    }
  }
);

router.post('/register',
  checkBanStatus,
  async (req, res, next) => {
    try {
      await registerUser(req, res);
    } catch (err) {
      next(err);
    }
  }
);

router.get('/getme',
  authenticateToken,
  getMe
);

module.exports = router;
