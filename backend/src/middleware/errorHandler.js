const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err);

  // Prisma unique constraint violation (P2002)
  if (err.code === 'P2002') {
    const target = err.meta?.target ? ` (${err.meta.target})` : '';
    return errorResponse(res, `A record with this field already exists${target}.`, 409);
  }

  // Prisma record not found (P2025)
  if (err.code === 'P2025') {
    return errorResponse(res, 'The requested record was not found.', 404);
  }

  // Payload too large (e.g. multer)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return errorResponse(res, 'File size too large. Maximum limit is 5MB.', 413);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return errorResponse(res, message, statusCode);
};

module.exports = {
  errorHandler,
};
