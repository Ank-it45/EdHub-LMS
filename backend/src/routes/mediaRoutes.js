const express = require('express');
const { upload, uploadMedia } = require('../controllers/mediaController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Authenticated user: Upload media
router.post('/upload', authenticate, upload.single('file'), uploadMedia);

module.exports = router;
