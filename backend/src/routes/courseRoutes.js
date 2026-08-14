const express = require('express');
const { body } = require('express-validator');
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { enrollCourse, getCourseEnrollments } = require('../controllers/enrollmentController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { handleValidationErrors } = require('../middleware/validate');

const router = express.Router();

// Public: Get all courses with search/filtering
router.get('/', getCourses);

// Public: Get course details
router.get('/:id', getCourseById);

// Instructor/Admin: Create course
router.post(
  '/',
  authenticate,
  authorize('INSTRUCTOR', 'ADMIN'),
  [
    body('title').trim().notEmpty().withMessage('Course title is required'),
    body('description').trim().notEmpty().withMessage('Course description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid course price is required'),
  ],
  handleValidationErrors,
  createCourse
);

// Instructor/Admin: Update course
router.patch(
  '/:id',
  authenticate,
  authorize('INSTRUCTOR', 'ADMIN'),
  updateCourse
);

// Instructor/Admin: Delete course
router.delete(
  '/:id',
  authenticate,
  authorize('INSTRUCTOR', 'ADMIN'),
  deleteCourse
);

// Authenticated User: Direct enroll
router.post('/:id/enroll', authenticate, enrollCourse);

// Instructor/Admin: List course enrollments
router.get(
  '/:id/enrollments',
  authenticate,
  authorize('INSTRUCTOR', 'ADMIN'),
  getCourseEnrollments
);

module.exports = router;
