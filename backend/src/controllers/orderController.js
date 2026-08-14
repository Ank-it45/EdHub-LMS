const prisma = require('../config/prisma');
const { generateMockTransactionId } = require('../utils/mockTxn');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * POST /orders - Create a pending order for authenticated user
 */
const createOrder = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return errorResponse(res, 'Course ID is required.', 400);
    }

    // 1. Fetch course from DB as source of truth for price & availability
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: { select: { id: true, name: true } },
      },
    });

    if (!course) {
      return errorResponse(res, 'Course not found.', 404);
    }

    // Instructors cannot purchase/enroll in their own courses.
    if ((req.user.role === 'INSTRUCTOR' || req.user.instructorRegistered) && course.instructor.id === userId) {
      return errorResponse(res, 'Instructors cannot purchase their own courses.', 403);
    }

    // 2. Prevent duplicate enrollment check upfront
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

    // 3. Create or reuse existing pending order
    let order = await prisma.order.findFirst({
      where: {
        userId,
        courseId,
        status: 'PENDING',
      },
      include: {
        payment: true,
        course: true,
      },
    });

    if (!order) {
      // Create new order with pending payment
      order = await prisma.order.create({
        data: {
          userId,
          courseId,
          amount: course.price,
          status: 'PENDING',
          payment: {
            create: {
              amount: course.price,
              status: 'PENDING',
            },
          },
        },
        include: {
          payment: true,
          course: {
            include: {
              instructor: { select: { id: true, name: true } },
            },
          },
        },
      });
    }

    return successResponse(
      res,
      order,
      'Pending order initialized. Ready for mock payment confirmation.',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /orders/me - List user's order history
 */
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        course: {
          include: {
            instructor: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(res, orders, 'Orders retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /orders/:id - Get specific order by ID
 */
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            instructor: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
        payment: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!order) {
      return errorResponse(res, 'Order not found.', 404);
    }

    // Authorization check
    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'You are not authorized to view this order.', 403);
    }

    return successResponse(res, order, 'Order fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /orders/:id/mock-pay - Execute mock payment, mark PLACED, and create enrollment
 */
const mockPayOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        payment: true,
        course: true,
      },
    });

    if (!order) {
      return errorResponse(res, 'Order not found.', 404);
    }

    if ((req.user.role === 'INSTRUCTOR' || req.user.instructorRegistered) && order.course.instructorId === userId) {
      return errorResponse(res, 'Instructors cannot purchase their own courses.', 403);
    }

    if (order.userId !== userId && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'You are not authorized to pay for this order.', 403);
    }

    if (order.status === 'PLACED') {
      return errorResponse(res, 'Order is already placed and paid for.', 400);
    }

    if (order.status === 'CANCELLED') {
      return errorResponse(res, 'Cannot pay for a cancelled order.', 400);
    }

    // Verify user is not already enrolled (defense in depth)
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: order.userId,
          courseId: order.courseId,
        },
      },
    });

    if (existingEnrollment) {
      return errorResponse(res, 'User is already enrolled in this course.', 400);
    }

    const transactionId = generateMockTransactionId();

    // Execute atomic transaction for state transitions
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update Payment to SUCCESS with transactionId
      const updatedPayment = await tx.payment.upsert({
        where: { orderId: order.id },
        update: {
          status: 'SUCCESS',
          transactionId,
          amount: order.amount,
        },
        create: {
          orderId: order.id,
          status: 'SUCCESS',
          transactionId,
          amount: order.amount,
        },
      });

      // 2. Update Order to PLACED
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: { status: 'PLACED' },
        include: { course: true },
      });

      // 3. Create Enrollment
      const enrollment = await tx.enrollment.create({
        data: {
          userId: order.userId,
          courseId: order.courseId,
          status: 'ACTIVE',
        },
        include: { course: true },
      });

      return {
        order: updatedOrder,
        payment: updatedPayment,
        enrollment,
        transactionId,
      };
    });

    return successResponse(
      res,
      result,
      'Order placed successfully! Enrollment has been activated.'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /orders/:id/cancel - Cancel pending order
 */
const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { payment: true },
    });

    if (!order) {
      return errorResponse(res, 'Order not found.', 404);
    }

    if ((req.user.role === 'INSTRUCTOR' || req.user.instructorRegistered) && order.course.instructorId === userId) {
      return errorResponse(res, 'Instructors cannot purchase their own courses.', 403);
    }

    if (order.userId !== userId && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'You are not authorized to cancel this order.', 403);
    }

    if (order.status === 'PLACED') {
      return errorResponse(res, 'Cannot cancel a completed/placed order.', 400);
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      if (order.payment) {
        await tx.payment.update({
          where: { orderId: order.id },
          data: { status: 'CANCELLED' },
        });
      }
      return tx.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED' },
        include: { payment: true, course: true },
      });
    });

    return successResponse(res, updatedOrder, 'Order cancelled successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /orders - Admin list all orders
 */
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true, price: true } },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(res, orders, 'All orders retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  mockPayOrder,
  cancelOrder,
  getAllOrders,
};
