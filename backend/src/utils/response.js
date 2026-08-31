/**
 * Standard API Response Utilities
 * Ensures consistent response contract across all REST endpoints
 */

export const successResponse = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== null && { data }),
  });
};

export const errorResponse = (res, message, statusCode = 500, code = 'ERROR', errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    code,
    ...(errors !== null && { errors }),
  });
};
