const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, registerAsInstructor } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  handleValidationErrors,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  handleValidationErrors,
  login
);

router.get('/me', authenticate, getMe);

router.post(
  '/register-instructor',
  authenticate,
  [body('bio').optional().isString().withMessage('Instructor bio must be text')],
  handleValidationErrors,
  registerAsInstructor
);

module.exports = router;
