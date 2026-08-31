import { config } from '../config/env.js';

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req, res, _next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint tidak ditemukan: ${req.method} ${req.originalUrl}`,
    code: 'RESOURCE_NOT_FOUND',
  });
};

/**
 * Global Error Handling Middleware
 * Ensures Shift-Left Security: prevents stack trace leakage in production
 */
export const globalErrorHandler = (err, req, res, _next) => {
  const statusCode = err.status || err.statusCode || 500;
  
  // Custom CORS error handling
  if (err.message && err.message.startsWith('CORS Error')) {
    return res.status(403).json({
      success: false,
      message: 'Akses ditolak oleh kebijakan keamanan CORS.',
      code: 'CORS_FORBIDDEN',
    });
  }

  // Generic secure response
  const response = {
    success: false,
    message: err.message || 'Terjadi kesalahan internal server.',
    code: err.code || 'INTERNAL_SERVER_ERROR',
  };

  // Only attach stack trace in development
  if (!config.isProduction) {
    response.stack = err.stack;
    if (err.details) {
      response.details = err.details;
    }
  }

  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);

  res.status(statusCode).json(response);
};
