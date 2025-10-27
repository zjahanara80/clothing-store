// const express = require('express');
// const router = express.Router();
// const discountController = require('../controllers/discountController');

// router.post('/', discountController.createDiscount);
// router.get('/', discountController.getAllDiscounts);

// module.exports = router;

const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');
const authenticateToken = require('../middleware/authenticateToken');

// فقط ادمین‌ها مثلاً می‌تونن تخفیف اضافه کنن (در ادامه می‌شه فیلتر هم گذاشت)
router.post('/', authenticateToken, discountController.createDiscount);
router.get('/', discountController.getAllDiscounts);

module.exports = router;