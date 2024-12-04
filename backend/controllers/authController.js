const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Login admin (garde ta fonction existante)
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !user.isAdmin) {
            return res.status(401).json({ message: 'Accès non autorisé' });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Nouvelles fonctions pour les utilisateurs normaux
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        const user = await User.create({
            name,
            email,
            password,
            isAdmin: false
        });

        const token = jwt.sign(
            { id: user._id, isAdmin: false },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Si un nouveau mot de passe est fourni, vérifier l'ancien
        if (req.body.newPassword) {

            // Vérifier la longueur du nouveau mot de passe
            if (req.body.newPassword.length < 6) {
                return res.status(400).json({
                    message: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
                });
            }

            // Vérifier que l'ancien mot de passe est fourni
            if (!req.body.currentPassword) {
                return res.status(400).json({
                    message: 'Le mot de passe actuel est requis pour changer de mot de passe'
                });
            }

            // Vérifier que l'ancien mot de passe est correct
            const isMatch = await user.matchPassword(req.body.currentPassword);
            if (!isMatch) {
                return res.status(400).json({
                    message: 'Le mot de passe actuel est incorrect'
                });
            }

            // Mettre à jour le mot de passe
            user.password = req.body.newPassword;
        }

        // Mettre à jour les autres champs
        user.name = req.body.name || user.name;

        // Vérifier si l'email est déjà utilisé par un autre utilisateur
        if (req.body.email && req.body.email !== user.email) {
            const emailExists = await User.findOne({
                email: req.body.email,
                _id: { $ne: user._id }
            });

            if (emailExists) {
                return res.status(400).json({
                    message: 'Cet email est déjà utilisé par un autre utilisateur'
                });
            }
            user.email = req.body.email;
        }

        const updatedUser = await user.save();

        // Générer un nouveau token
        const token = jwt.sign(
            { id: updatedUser._id, isAdmin: updatedUser.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token, // Renvoyer le nouveau token
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || 'Erreur lors de la mise à jour du profil'
        });
    }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Admin only
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Admin only
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Empêcher la suppression d'un admin
        if (user.isAdmin) {
            return res.status(400).json({ message: 'Impossible de supprimer un administrateur' });
        }

        await user.deleteOne();
        res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user role
// @route   PUT /api/auth/users/:id/role
// @access  Admin only
exports.updateUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Empêcher la modification du rôle d'un admin par un autre admin
        if (user.isAdmin && req.user.id !== user._id.toString()) {
            return res.status(400).json({ message: 'Impossible de modifier le rôle d\'un autre administrateur' });
        }

        user.isAdmin = req.body.isAdmin;
        const updatedUser = await user.save();

        res.json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};