import { Router } from 'express';

const router = Router();

/**
 * @route   GET /api/health
 * @desc    Check system health, timestamp, environment, and uptime
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend API SDN 2 Tegalsari Kepanjen beroperasi normal.',
    data: {
      status: 'UP',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
    },
  });
});

export default router;
