const express = require('express');
const router = express.Router();
const {
    login,
    loginAdmin,
    register,
    getUserProfile,
    updateUserProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Routes publiques
router.post('/register', register);
router.post('/login', login);
router.post('/loginAdmin', loginAdmin); // ta route admin existante

// Routes protégées
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

module.exports = router;