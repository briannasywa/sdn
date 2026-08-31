import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import prisma from '../config/db.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & issue 1-hour JWT token + HTTP-only cookie
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Shift-Left Security: Input Validation
    if (!email || !password) {
      return errorResponse(
        res,
        'Email dan kata sandi wajib diisi.',
        400,
        'MISSING_CREDENTIALS'
      );
    }

    // Find User
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        studentProfile: {
          include: {
            classRoom: true,
          },
        },
        teacherProfile: true,
      },
    });

    if (!user) {
      // DevSecOps: Use generic error message to prevent account enumeration
      return errorResponse(
        res,
        'Email atau kata sandi tidak valid.',
        401,
        'INVALID_CREDENTIALS'
      );
    }

    // Verify Password Hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return errorResponse(
        res,
        'Email atau kata sandi tidak valid.',
        401,
        'INVALID_CREDENTIALS'
      );
    }

    // Generate JWT Token (1 hour validity as required)
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    // Set Secure HTTP-Only Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: config.isProduction ? 'strict' : 'lax',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Sanitized User Response (Never return password hash!)
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentProfile: user.studentProfile,
      teacherProfile: user.teacherProfile,
      created_at: user.created_at,
    };

    return successResponse(
      res,
      'Login berhasil. Selamat datang di Portal SDN 2 Tegalsari.',
      {
        token,
        token_type: 'Bearer',
        expires_in: 3600, // 1 hour in seconds
        user: userResponse,
      }
    );
  } catch (error) {
    console.error('[Login Controller Error]:', error);
    return errorResponse(
      res,
      'Terjadi kesalahan saat memproses login.',
      500,
      'LOGIN_ERROR'
    );
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged in user profile
 * @access  Private
 */
export const getCurrentUser = async (req, res) => {
  try {
    return successResponse(
      res,
      'Profil pengguna berhasil dimuat.',
      { user: req.user }
    );
  } catch (error) {
    console.error('[Get Current User Error]:', error);
    return errorResponse(res, 'Gagal mengambil data profil.', 500, 'GET_ME_ERROR');
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and clear auth cookie
 * @access  Private
 */
export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: config.isProduction ? 'strict' : 'lax',
    });

    return successResponse(res, 'Logout berhasil.');
  } catch (error) {
    console.error('[Logout Error]:', error);
    return errorResponse(res, 'Gagal memproses logout.', 500, 'LOGOUT_ERROR');
  }
};
