const express = require('express');
const { getUserProfile, updateUserProfile, getAllUsers } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

const router = express.Router();

// Admin only: list all users
router.get('/', authenticate, authorize('ADMIN'), getAllUsers);

// Get user profile
router.get('/:id', authenticate, getUserProfile);

// Update user profile
router.patch('/:id', authenticate, updateUserProfile);

module.exports = router;
