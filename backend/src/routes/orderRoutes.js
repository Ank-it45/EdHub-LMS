const express = require('express');
const { body } = require('express-validator');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  mockPayOrder,
  cancelOrder,
  getAllOrders,
} = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { handleValidationErrors } = require('../middleware/validate');

const router = express.Router();

// Authenticated: Create pending order
router.post(
  '/',
  authenticate,
  [body('courseId').trim().notEmpty().withMessage('Course ID is required')],
  handleValidationErrors,
  createOrder
);

// Authenticated: Get my orders
router.get('/me', authenticate, getMyOrders);

// Admin: Get all system orders
router.get('/', authenticate, authorize('ADMIN'), getAllOrders);

// Authenticated: Get single order
router.get('/:id', authenticate, getOrderById);

// Authenticated: Confirm simulated mock payment
router.post('/:id/mock-pay', authenticate, mockPayOrder);

// Authenticated: Cancel pending order
router.post('/:id/cancel', authenticate, cancelOrder);

module.exports = router;
