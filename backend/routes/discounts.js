const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');
const authenticateToken = require('../middleware/authenticateToken');

// just admin can insert a discount
router.post('/', authenticateToken, discountController.createDiscount);
router.get('/', discountController.getAllDiscounts);

module.exports = router;