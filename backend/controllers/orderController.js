const Order = require('../models/orderModel');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Admin only
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email')
            .populate('orderItems.product', 'name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Admin only
exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }

        order.isDelivered = req.body.isDelivered || order.isDelivered;
        if (req.body.isDelivered) {
            order.deliveredAt = Date.now();
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Admin/User
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('orderItems.product', 'name');

        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
    try {
        console.log("User from request:", req.user); // Pour voir ce qu'on reçoit

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not found in request' });
        }

        const orders = await Order.find({ user: req.user.id }) // Utilise req.user.id au lieu de req.user._id
            .populate('user', 'name email')
            .populate('orderItems.product', 'name image price')
            .sort('-createdAt');

        console.log("Orders found:", orders); // Pour voir les commandes trouvées
        res.json(orders);
    } catch (error) {
        console.error("Error in getMyOrders:", error); // Pour voir l'erreur complète
        res.status(500).json({ message: error.message });
    }
};