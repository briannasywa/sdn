import prisma from '../config/db.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * @route   GET /api/academic/classrooms
 * @desc    Get list of classrooms
 * @access  Private (Teacher & Admin)
 */
export const getClassrooms = async (req, res) => {
  try {
    const classrooms = await prisma.classRoom.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { students: true },
        },
      },
    });

    return successResponse(res, 'Daftar kelas berhasil diambil.', classrooms);
  } catch (error) {
    console.error('[Get Classrooms Error]:', error);
    return errorResponse(res, 'Gagal mengambil data kelas.', 500, 'GET_CLASSROOMS_ERROR');
  }
};

/**
 * @route   GET /api/academic/students
 * @desc    Get list of students with profiles
 * @access  Private (Teacher & Admin)
 */
export const getStudents = async (req, res) => {
  try {
    const { classId, search } = req.query;

    const where = { role: 'STUDENT' };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { studentProfile: { nisn: { contains: search } } },
      ];
    }

    if (classId) {
      where.studentProfile = { classId };
    }

    const students = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        studentProfile: {
          include: { classRoom: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return successResponse(res, 'Daftar siswa berhasil diambil.', students);
  } catch (error) {
    console.error('[Get Students Error]:', error);
    return errorResponse(res, 'Gagal mengambil data siswa.', 500, 'GET_STUDENTS_ERROR');
  }
};

/**
 * @route   GET /api/academic/teachers
 * @desc    Get list of teachers
 * @access  Private (Admin & Teacher)
 */
export const getTeachers = async (req, res) => {
  try {
    const teachers = await prisma.user.findMany({
      where: { role: 'TEACHER' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        teacherProfile: true,
      },
      orderBy: { name: 'asc' },
    });

    return successResponse(res, 'Daftar guru berhasil diambil.', teachers);
  } catch (error) {
    console.error('[Get Teachers Error]:', error);
    return errorResponse(res, 'Gagal mengambil data guru.', 500, 'GET_TEACHERS_ERROR');
  }
};
