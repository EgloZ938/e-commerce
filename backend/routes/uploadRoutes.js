const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier uploadé' });
    }
    res.json({
        message: 'Image uploadée avec succès',
        imagePath: `/uploads/${req.file.filename}`
    });
});

module.exports = router;
