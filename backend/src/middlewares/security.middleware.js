import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

/**
 * Helmet Security Headers Configuration
 * Shifts security to the left by preventing common web vulnerabilities (XSS, Clickjacking, Sniffing)
 */
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
      connectSrc: ["'self'", config.frontendUrl],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: config.isProduction ? [] : null,
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  hidePoweredBy: true,
  xssFilter: true,
  noSniff: true,
  ieNoOpen: true,
});

/**
 * Strict CORS Configuration
 * Restricts origin access strictly to Vite frontend (localhost:5173 by default)
 */
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server) in dev
    const allowedOrigins = [config.frontendUrl];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS Error: Origin ${origin} is not allowed by DevSecOps policy.`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400, // 24 hours
});

/**
 * Global Rate Limiter
 * Mitigates DoS / DDoS and brute force scanning (e.g. 100 requests per 15 minutes)
 */
export const globalRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true, // Return standard rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Terlalu banyak permintaan dari IP ini. Silakan coba lagi setelah 15 menit.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  handler: (req, res, next, options) => {
    res.status(429).json(options.message);
  },
});

/**
 * Auth Rate Limiter (Brute-force protection for sensitive endpoints like login)
 * 10 requests per 15 minutes window per IP
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak percobaan autentikasi. Akun terkunci sementara demi keamanan (15 menit).',
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
  },
  handler: (req, res, next, options) => {
    res.status(429).json(options.message);
  },
});
