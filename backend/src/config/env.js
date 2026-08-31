import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'fallback_dev_secret_replace_in_production_min32chars',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  databaseUrl: process.env.DATABASE_URL || '',
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: Number(process.env.RATE_LIMIT_MAX) || 100, // Limit each IP to 100 requests per `window`
  },
};
