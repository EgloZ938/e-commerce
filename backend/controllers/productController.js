const Product = require('../models/productModel');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).populate('user', 'name email');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('user', 'name email');
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all products
// @route   GET /api/products
exports.getProducts = async (req, res) => {
    try {
        console.log('Tentative de récupération des produits...');
        const products = await Product.find({});
        console.log('Produits récupérés:', products);
        res.json(products);
    } catch (error) {
        console.error('Erreur dans getProducts:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des produits',
            error: error.message 
        });
    }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
    try {
        const product = new Product({
            ...req.body,
            user: req.user.id
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        // Utiliser deleteOne au lieu de remove
        await Product.deleteOne({ _id: req.params.id });

        res.status(200).json({
            success: true,
            message: 'Produit supprimé avec succès'
        });
    } catch (error) {
        console.error('Erreur de suppression:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du produit',
            error: error.message
        });
    }
};