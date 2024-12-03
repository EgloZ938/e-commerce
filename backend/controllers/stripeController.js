const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');

exports.createPaymentIntent = async (req, res) => {
    try {
        // Au lieu d'utiliser cartId du body, on utilise l'ID de l'utilisateur
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

        if (!cart || !cart.items.length) {
            return res.status(400).json({ message: 'Panier vide' });
        }

        // Calculer le total
        const total = cart.items.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        // Créer le payment intent avec le montant en centimes
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100),
            currency: 'eur',
            metadata: {
                userId: req.user._id.toString(),
                cartId: cart._id.toString()
            }
        });

        res.json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({
            message: error.message,
            error: error
        });
    }
};

exports.handlePaymentSuccess = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        // Vérifier le paiement avec Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            const cartId = paymentIntent.metadata.cartId;
            const userId = paymentIntent.metadata.userId;

            // Récupérer le panier
            const cart = await Cart.findById(cartId).populate('items.product');

            // Créer la commande
            const order = new Order({
                user: userId,
                orderItems: cart.items.map(item => ({
                    name: item.product.name,
                    qty: item.quantity,
                    image: item.product.image,
                    price: item.product.price,
                    product: item.product._id
                })),
                totalPrice: cart.total,
                isPaid: true,
                paidAt: Date.now()
            });

            await order.save();

            // Vider le panier
            cart.items = [];
            cart.total = 0;
            await cart.save();

            res.json({
                success: true,
                order: order
            });
        } else {
            throw new Error('Payment failed');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};