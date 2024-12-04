const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    getOrders,
    updateOrder,
    getOrderById,
    getMyOrders
} = require('../controllers/orderController');

// Place myorders AVANT les routes avec :id
router.get('/myorders', protect, getMyOrders);

router.route('/')
    .get(protect, admin, getOrders);

router.route('/:id')
    .get(protect, getOrderById)
    .put(protect, admin, updateOrder);

module.exports = router;