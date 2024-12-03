const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createPaymentIntent, handlePaymentSuccess } = require('../controllers/stripeController');

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/payment-success', protect, handlePaymentSuccess);

module.exports = router;