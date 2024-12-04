const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const {
    login,
    loginAdmin,
    register,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    deleteUser,
    updateUserRole
} = require('../controllers/authController');

const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Routes publiques
router.post('/register', register);
router.post('/login', login);
router.post('/loginAdmin', loginAdmin);

// Routes protégées
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Routes admin
router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/users/:id/role', protect, admin, updateUserRole);

router.put('/profile/avatar', protect, upload.single('avatar'), async (req, res) => {
    try {
        console.log('req.user:', req.user); // Debug
        console.log('req.file:', req.file); // Debug

        const user = await User.findById(req.user._id);
        if (user) {
            user.avatar = req.file.filename;
            const updatedUser = await user.save();

            res.json({
                message: 'Avatar mis à jour avec succès',
                avatar: updatedUser.avatar
            });
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        console.error('Erreur complète:', error); // Debug
        res.status(500).json({
            message: 'Erreur lors de la mise à jour de l\'avatar',
            error: error.message
        });
    }
});

module.exports = router;