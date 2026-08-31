import { Router } from 'express';
import { login, getCurrentUser, logout } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authRateLimiter } from '../middlewares/security.middleware.js';

const router = Router();

// Public route with brute-force rate limiter
router.post('/login', authRateLimiter, login);

// Private authenticated routes
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);

export default router;
