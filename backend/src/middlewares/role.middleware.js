import { errorResponse } from '../utils/response.js';

/**
 * Role-Based Access Control (RBAC) Middleware
 * @param  {...string} allowedRoles - List of permitted roles (e.g. 'ADMIN', 'TEACHER', 'STUDENT')
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(
        res,
        'Autentikasi diperlukan sebelum pemeriksaan role.',
        401,
        'UNAUTHENTICATED'
      );
    }

    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      return errorResponse(
        res,
        `Akses terlarang. Peran '${userRole}' tidak memiliki izin untuk tindakan ini.`,
        403,
        'FORBIDDEN_ROLE'
      );
    }

    next();
  };
};

export const requireAdmin = requireRole('ADMIN');
export const requireTeacherOrAdmin = requireRole('ADMIN', 'TEACHER');
export const requireStudent = requireRole('STUDENT');
