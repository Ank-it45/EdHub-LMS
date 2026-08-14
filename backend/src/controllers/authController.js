const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { successResponse, errorResponse, sanitizeUser } = require('../utils/response');

const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, role, bio } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return errorResponse(res, 'An account with this email already exists.', 409);
    }

    // Role safeguard: Only allow STUDENT or INSTRUCTOR on self-registration
    const assignedRole = role === 'INSTRUCTOR' ? 'INSTRUCTOR' : 'STUDENT';

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: assignedRole,
        bio: bio || null,
      },
    });

    const token = generateToken(user);

    return successResponse(
      res,
      {
        user: sanitizeUser(user),
        token,
      },
      'User registered successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};


const registerAsInstructor = async (req, res, next) => {
  try {
    const { bio } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return errorResponse(res, 'User not found.', 404);
    }

    if (user.role !== 'STUDENT') {
      return errorResponse(res, 'Only student accounts can register as instructors from the student experience.', 403);
    }

    if (user.instructorRegistered) {
      return errorResponse(res, 'You are already registered as an instructor with this account.', 409);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        instructorRegistered: true,
        ...(bio !== undefined && { bio: bio || null }),
      },
    });

    return successResponse(
      res,
      { user: sanitizeUser(updatedUser) },
      'Instructor registration completed for your existing account.'
    );
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    const token = generateToken(user);

    return successResponse(
      res,
      {
        user: sanitizeUser(user),
        token,
      },
      'Login successful'
    );
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        _count: {
          select: {
            enrollments: true,
            courses: true,
            orders: true,
          },
        },
      },
    });

    if (!user) {
      return errorResponse(res, 'User not found.', 404);
    }

    return successResponse(res, sanitizeUser(user), 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  registerAsInstructor,
};
