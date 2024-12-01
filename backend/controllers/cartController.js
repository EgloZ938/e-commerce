const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id;

        // Vérifier si le produit existe et est en stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        if (product.countInStock < quantity) {
            return res.status(400).json({ message: "Quantité non disponible" });
        }

        // Chercher le panier existant ou en créer un nouveau
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [], total: 0 });
        }

        // Vérifier si le produit est déjà dans le panier
        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        // Calculer le nouveau total
        const populatedCart = await cart.populate('items.product');
        cart.total = populatedCart.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
            .populate('items.product');
        res.status(200).json(cart || { items: [], total: 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: "Panier non trouvé" });
        }

        const item = cart.items.find(item => item.product.toString() === productId);
        if (!item) {
            return res.status(404).json({ message: "Produit non trouvé dans le panier" });
        }

        item.quantity = quantity;
        await cart.save();

        // Repeupler les données du produit après la mise à jour
        cart = await Cart.findById(cart._id).populate('items.product');

        // Recalculer le total
        cart.total = cart.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);

        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: "Panier non trouvé" });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();

        // Repeupler les données du produit après la suppression
        cart = await Cart.findById(cart._id).populate('items.product');

        // Recalculer le total
        cart.total = cart.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);

        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ message: error.message });
    }
};