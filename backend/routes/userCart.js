const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authenticateToken = require('../middleware/authenticateToken');
const cartController = require('../controllers/cartController');

// add or remove prduct (toggle)
router.post('/toggle/:productId', authenticateToken, cartController.toggleProduct);

// add or increase product to buy basket
router.post('/add', authenticateToken, cartController.addToCart);

// update product count
router.post('/update-quantity', authenticateToken, cartController.updateQuantity);

// remove product from buy basket
router.post('/remove', authenticateToken, cartController.removeFromCart);

// get buy basket
router.get('/', authenticateToken, cartController.getCart);

module.exports = router;
