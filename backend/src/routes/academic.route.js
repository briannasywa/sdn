import { Router } from 'express';
import { getClassrooms, getStudents, getTeachers } from '../controllers/academic.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireTeacherOrAdmin } from '../middlewares/role.middleware.js';

const router = Router();

router.get('/classrooms', authenticate, requireTeacherOrAdmin, getClassrooms);
router.get('/students', authenticate, requireTeacherOrAdmin, getStudents);
router.get('/teachers', authenticate, requireTeacherOrAdmin, getTeachers);

export default router;
