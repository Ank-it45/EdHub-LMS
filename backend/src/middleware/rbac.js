const { errorResponse } = require('../utils/response');

/**
 * Middleware to restrict access based on user role(s)
 * @param  {...string} allowedRoles - e.g. 'INSTRUCTOR', 'ADMIN'
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required before authorization.', 401);
    }

    const effectiveRoles = [req.user.role];
    if (req.user.instructorRegistered && !effectiveRoles.includes('INSTRUCTOR')) {
      effectiveRoles.push('INSTRUCTOR');
    }

    if (!allowedRoles.some((role) => effectiveRoles.includes(role))) {
      return errorResponse(
        res,
        `Access denied. Requires one of the following roles: [${allowedRoles.join(', ')}]. Current roles: [${effectiveRoles.join(', ')}]`,
        403
      );
    }

    next();
  };
};

module.exports = {
  authorize,
};
