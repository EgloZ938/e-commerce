const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart
} = require('../controllers/cartController');

router.route('/')
    .get(protect, getCart)
    .post(protect, addToCart)
    .put(protect, updateCartItem);

router.delete('/:productId', protect, removeFromCart);

module.exports = router;