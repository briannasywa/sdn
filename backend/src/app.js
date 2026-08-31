import express from 'express';
import cookieParser from 'cookie-parser';
import { helmetMiddleware, corsMiddleware, globalRateLimiter } from './middlewares/security.middleware.js';
import { notFoundHandler, globalErrorHandler } from './middlewares/error.middleware.js';

// Route Imports
import healthRoutes from './routes/health.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import gradeRoutes from './routes/grade.route.js';
import academicRoutes from './routes/academic.route.js';

const app = express();

/* =========================================================================
   DEVSECOPS SECURITY MIDDLEWARE PIPELINE (Order of Execution Matters!)
   ========================================================================= */

// 1. HTTP Security Headers (Helmet.js)
app.use(helmetMiddleware);

// 2. Strict CORS policy
app.use(corsMiddleware);

// 3. Global Rate Limiter (100 req / 15 min)
app.use(globalRateLimiter);

// 4. Payload Size Limits (10kb max)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 5. Cookie Parser
app.use(cookieParser());

// 6. Request Logging (Development Mode)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    });
    next();
  });
}

/* =========================================================================
   RESTFUL API ROUTES
   ========================================================================= */

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/academic', academicRoutes);

// Base API Endpoint Index
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'REST API SDN 2 Tegalsari Kepanjen (Anti-Gravity & DevSecOps Platform)',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      posts: '/api/posts',
      grades: '/api/grades',
      academic: '/api/academic',
    },
  });
});

/* =========================================================================
   ERROR HANDLING PIPELINE
   ========================================================================= */

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
