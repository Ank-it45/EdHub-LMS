const prisma = require('../config/prisma');
const { successResponse, errorResponse } = require('../utils/response');

const getCourses = async (req, res, next) => {
  try {
    const { search, category, level, instructorId, sort = 'newest' } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category && category !== 'All') {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (level && level !== 'All') {
      where.level = { equals: level, mode: 'insensitive' };
    }

    if (instructorId) {
      where.instructorId = instructorId;
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'price-asc') orderBy = { price: 'asc' };
    if (sort === 'price-desc') orderBy = { price: 'desc' };
    if (sort === 'title') orderBy = { title: 'asc' };

    const courses = await prisma.course.findMany({
      where,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            bio: true,
          },
        },
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy,
    });

    return successResponse(res, courses, 'Courses retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            bio: true,
          },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });

    if (!course) {
      return errorResponse(res, 'Course not found.', 404);
    }

    return successResponse(res, course, 'Course details fetched successfully');
  } catch (error) {
    next(error);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const { title, description, price, thumbnailUrl, category, level, learningOutcomes } = req.body;

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return errorResponse(res, 'Price must be a valid non-negative number.', 400);
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        price: parsedPrice,
        thumbnailUrl: thumbnailUrl || null,
        category: category || 'Development',
        level: level || 'Beginner',
        learningOutcomes: Array.isArray(learningOutcomes)
          ? learningOutcomes.map((item) => String(item).trim()).filter(Boolean)
          : [],
        instructorId: req.user.id,
      },
      include: {
        instructor: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    return successResponse(res, course, 'Course created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, price, thumbnailUrl, category, level, learningOutcomes } = req.body;

    const existingCourse = await prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return errorResponse(res, 'Course not found.', 404);
    }

    // Ownership check: Instructor must own the course, or user must be ADMIN
    if (existingCourse.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'You are not authorized to update this course.', 403);
    }

    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;
    if (thumbnailUrl !== undefined) dataToUpdate.thumbnailUrl = thumbnailUrl;
    if (category !== undefined) dataToUpdate.category = category;
    if (level !== undefined) dataToUpdate.level = level;
    if (learningOutcomes !== undefined) {
      if (!Array.isArray(learningOutcomes)) {
        return errorResponse(res, 'Learning outcomes must be provided as an array.', 400);
      }
      dataToUpdate.learningOutcomes = learningOutcomes
        .map((item) => String(item).trim())
        .filter(Boolean);
    }
    if (price !== undefined) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return errorResponse(res, 'Price must be a valid non-negative number.', 400);
      }
      dataToUpdate.price = parsedPrice;
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: dataToUpdate,
      include: {
        instructor: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    return successResponse(res, updatedCourse, 'Course updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingCourse = await prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return errorResponse(res, 'Course not found.', 404);
    }

    // Ownership check
    if (existingCourse.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'You are not authorized to delete this course.', 403);
    }

    await prisma.course.delete({
      where: { id },
    });

    return successResponse(res, null, 'Course deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
