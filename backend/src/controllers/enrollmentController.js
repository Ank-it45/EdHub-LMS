const prisma = require('../config/prisma');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * POST /courses/:id/enroll - Direct enrollment endpoint
 */
const enrollCourse = async (req, res, next) => {
  try {
    const { id: courseId } = req.params;
    const userId = req.user.id;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return errorResponse(res, 'Course not found.', 404);
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return errorResponse(res, 'You are already enrolled in this course.', 400);
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: 'ACTIVE',
      },
      include: {
        course: {
          include: {
            instructor: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
      },
    });

    return successResponse(res, enrollment, 'Successfully enrolled in course.', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /enrollments/me - List the authenticated user's enrollments
 */
const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user.id },
      include: {
        course: {
          include: {
            instructor: {
              select: { id: true, name: true, avatarUrl: true, bio: true },
            },
            _count: {
              select: { enrollments: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(res, enrollments, 'Enrollments retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /courses/:id/enrollments - List course enrollments for instructors/admin
 */
const getCourseEnrollments = async (req, res, next) => {
  try {
    const { id: courseId } = req.params;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return errorResponse(res, 'Course not found.', 404);
    }

    // Ownership check
    if (course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'You are not authorized to view enrollments for this course.', 403);
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(res, enrollments, 'Course enrollments retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  enrollCourse,
  getMyEnrollments,
  getCourseEnrollments,
};
