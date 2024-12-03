const express = require('express');
const router = express.Router();
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

module.exports = router;