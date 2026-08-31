import { Router } from 'express';
import {
  getAllPosts,
  getPostBySlugOrId,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/post.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/role.middleware.js';

const router = Router();

// Public routes
router.get('/', getAllPosts);
router.get('/:slugOrId', getPostBySlugOrId);

// Admin-only CMS routes
router.post('/', authenticate, requireAdmin, createPost);
router.put('/:id', authenticate, requireAdmin, updatePost);
router.delete('/:id', authenticate, requireAdmin, deletePost);

export default router;
