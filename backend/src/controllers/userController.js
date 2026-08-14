const prisma = require('../config/prisma');
const { successResponse, errorResponse, sanitizeUser } = require('../utils/response');

const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
        courses: {
          select: {
            id: true,
            title: true,
            price: true,
            thumbnailUrl: true,
            category: true,
            level: true,
            _count: {
              select: { enrollments: true },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
            courses: true,
          },
        },
      },
    });

    if (!user) {
      return errorResponse(res, 'User not found.', 404);
    }

    return successResponse(res, user, 'User profile fetched successfully');
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, bio, avatarUrl } = req.body;

    // Authorization rule: Users can only update their own profile unless they are ADMIN
    if (req.user.id !== id && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'You are not authorized to update this profile.', 403);
    }

    const dataToUpdate = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (bio !== undefined) dataToUpdate.bio = bio;
    if (avatarUrl !== undefined) dataToUpdate.avatarUrl = avatarUrl;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });

    return successResponse(res, sanitizeUser(updatedUser), 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

// Admin route to list users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: {
            courses: true,
            enrollments: true,
            orders: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(res, users, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
};
