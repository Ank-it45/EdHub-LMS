const express = require('express');
const { getMyEnrollments } = require('../controllers/enrollmentController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Authenticated user: Get my enrolled courses
router.get('/me', authenticate, getMyEnrollments);

module.exports = router;
