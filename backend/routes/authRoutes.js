const express = require('express');
const router = express.Router();
const { login, getProfile } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/loginAdmin', login);
router.get('/profile', protect, admin, getProfile);

module.exports = router;