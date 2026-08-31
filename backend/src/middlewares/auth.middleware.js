import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import prisma from '../config/db.js';
import { errorResponse } from '../utils/response.js';

/**
 * JWT Authentication Middleware
 * Shifts security to the left by validating token authenticity and active user existence
 */
export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check Authorization Bearer header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      // 2. Check signed/unsigned HTTP-only cookie
      token = req.cookies.token;
    }

    if (!token) {
      return errorResponse(
        res,
        'Akses ditolak. Token autentikasi tidak ditemukan.',
        401,
        'UNAUTHENTICATED'
      );
    }

    // 3. Verify Token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return errorResponse(
          res,
          'Sesi Anda telah berakhir. Silakan login kembali.',
          401,
          'TOKEN_EXPIRED'
        );
      }
      return errorResponse(
        res,
        'Token tidak valid atau telah dirusak.',
        401,
        'INVALID_TOKEN'
      );
    }

    // 4. Verify User Still Exists in Database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId || decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        studentProfile: {
          include: {
            classRoom: true,
          },
        },
        teacherProfile: true,
      },
    });

    if (!user) {
      return errorResponse(
        res,
        'User tidak ditemukan atau akun telah dihapus.',
        401,
        'USER_NOT_FOUND'
      );
    }

    // Attach authenticated user to request context
    req.user = user;
    next();
  } catch (error) {
    console.error('[Auth Middleware Error]:', error);
    return errorResponse(
      res,
      'Terjadi kesalahan saat memverifikasi autentikasi.',
      500,
      'AUTH_SERVER_ERROR'
    );
  }
};
