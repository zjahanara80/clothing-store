
// const express = require('express');
// const router = express.Router();
// const cartController = require('../controllers/cartController');
// const authenticateToken = require('../middleware/authenticateToken');

// router.post('/add', authenticateToken, cartController.addToCart);
// router.get('/', authenticateToken, cartController.getCart);
// router.post('/remove', authenticateToken, cartController.removeFromCart);
// router.post('/update-quantity', authenticateToken, cartController.updateQuantity);

// module.exports = router;

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const cartController = require('../controllers/cartController');

router.post('/add', authenticateToken, cartController.addToCart);
router.get('/', authenticateToken, cartController.getCart);
router.post('/remove', authenticateToken, cartController.removeFromCart);
router.post('/update-quantity', authenticateToken, cartController.updateQuantity);

module.exports = router;