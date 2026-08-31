import { Router } from 'express';
import {
  getMyGrades,
  createGrade,
  getAllGrades,
  updateGrade,
  deleteGrade,
} from '../controllers/grade.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireStudent, requireTeacherOrAdmin, requireAdmin } from '../middlewares/role.middleware.js';

const router = Router();

// Student-only: view own grades
router.get('/my-grades', authenticate, requireStudent, getMyGrades);

// Teacher & Admin: view all grades and input grades
router.get('/', authenticate, requireTeacherOrAdmin, getAllGrades);
router.post('/', authenticate, requireTeacherOrAdmin, createGrade);
router.put('/:id', authenticate, requireTeacherOrAdmin, updateGrade);

// Admin-only: delete grade
router.delete('/:id', authenticate, requireAdmin, deleteGrade);

export default router;
