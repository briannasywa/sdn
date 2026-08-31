import prisma from '../config/db.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * @route   GET /api/grades/my-grades
 * @desc    Get grades for the authenticated student
 * @access  Private (Student Only)
 */
export const getMyGrades = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { academic_year, semester } = req.query;

    const where = { studentId };
    if (academic_year) where.academic_year = academic_year;
    if (semester) where.semester = semester;

    const grades = await prisma.grade.findMany({
      where,
      orderBy: [{ academic_year: 'desc' }, { semester: 'desc' }, { subject: 'asc' }],
    });

    // Calculate Summary Stats (GPA / Average)
    const totalScore = grades.reduce((acc, curr) => acc + curr.score, 0);
    const averageScore = grades.length > 0 ? (totalScore / grades.length).toFixed(2) : 0;

    return successResponse(res, 'Data nilai siswa berhasil dimuat.', {
      student: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        nisn: req.user.studentProfile?.nisn,
        class: req.user.studentProfile?.classRoom?.name || '-',
      },
      summary: {
        totalSubjects: grades.length,
        averageScore: Number(averageScore),
      },
      grades,
    });
  } catch (error) {
    console.error('[Get My Grades Error]:', error);
    return errorResponse(res, 'Gagal mengambil data nilai siswa.', 500, 'GET_MY_GRADES_ERROR');
  }
};

/**
 * @route   POST /api/grades
 * @desc    Input new grade for a student
 * @access  Private (Teacher & Admin Only)
 */
export const createGrade = async (req, res) => {
  try {
    const { studentId, subject, score, semester, academic_year } = req.body;

    // Shift-Left Validation
    if (!studentId || !subject || score === undefined || !semester || !academic_year) {
      return errorResponse(
        res,
        'Semua kolom (studentId, subject, score, semester, academic_year) wajib diisi.',
        400,
        'VALIDATION_ERROR'
      );
    }

    const numScore = parseFloat(score);
    if (isNaN(numScore) || numScore < 0 || numScore > 100) {
      return errorResponse(res, 'Nilai harus berupa angka antara 0 hingga 100.', 400, 'INVALID_SCORE');
    }

    // Verify student exists and has STUDENT role
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: { studentProfile: true },
    });

    if (!student || student.role !== 'STUDENT') {
      return errorResponse(res, 'Siswa dengan ID tersebut tidak ditemukan.', 404, 'STUDENT_NOT_FOUND');
    }

    const newGrade = await prisma.grade.create({
      data: {
        studentId,
        subject: subject.trim(),
        score: numScore,
        semester: semester.trim(),
        academic_year: academic_year.trim(),
      },
      include: {
        student: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return successResponse(res, 'Nilai berhasil disimpan.', newGrade, 201);
  } catch (error) {
    console.error('[Create Grade Error]:', error);
    return errorResponse(res, 'Gagal menyimpan nilai.', 500, 'CREATE_GRADE_ERROR');
  }
};

/**
 * @route   GET /api/grades
 * @desc    Get all grades list (filterable by studentId, subject, academic_year)
 * @access  Private (Teacher & Admin Only)
 */
export const getAllGrades = async (req, res) => {
  try {
    const { studentId, subject, semester, academic_year, classId } = req.query;

    const where = {};
    if (studentId) where.studentId = studentId;
    if (subject) where.subject = { contains: subject, mode: 'insensitive' };
    if (semester) where.semester = semester;
    if (academic_year) where.academic_year = academic_year;

    if (classId) {
      where.student = {
        studentProfile: {
          classId,
        },
      };
    }

    const grades = await prisma.grade.findMany({
      where,
      orderBy: [{ created_at: 'desc' }],
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            studentProfile: {
              include: { classRoom: true },
            },
          },
        },
      },
    });

    return successResponse(res, 'Daftar nilai berhasil diambil.', { grades });
  } catch (error) {
    console.error('[Get All Grades Error]:', error);
    return errorResponse(res, 'Gagal mengambil daftar nilai.', 500, 'GET_ALL_GRADES_ERROR');
  }
};

/**
 * @route   PUT /api/grades/:id
 * @desc    Update grade
 * @access  Private (Teacher & Admin Only)
 */
export const updateGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, subject, semester, academic_year } = req.body;

    const existingGrade = await prisma.grade.findUnique({
      where: { id },
    });

    if (!existingGrade) {
      return errorResponse(res, 'Data nilai tidak ditemukan.', 404, 'GRADE_NOT_FOUND');
    }

    const updateData = {};
    if (score !== undefined) {
      const numScore = parseFloat(score);
      if (isNaN(numScore) || numScore < 0 || numScore > 100) {
        return errorResponse(res, 'Nilai harus berupa angka antara 0 hingga 100.', 400, 'INVALID_SCORE');
      }
      updateData.score = numScore;
    }
    if (subject) updateData.subject = subject.trim();
    if (semester) updateData.semester = semester.trim();
    if (academic_year) updateData.academic_year = academic_year.trim();

    const updatedGrade = await prisma.grade.update({
      where: { id },
      data: updateData,
      include: {
        student: {
          select: { id: true, name: true },
        },
      },
    });

    return successResponse(res, 'Nilai berhasil diperbarui.', updatedGrade);
  } catch (error) {
    console.error('[Update Grade Error]:', error);
    return errorResponse(res, 'Gagal memperbarui nilai.', 500, 'UPDATE_GRADE_ERROR');
  }
};

/**
 * @route   DELETE /api/grades/:id
 * @desc    Delete grade
 * @access  Private (Admin Only)
 */
export const deleteGrade = async (req, res) => {
  try {
    const { id } = req.params;

    const existingGrade = await prisma.grade.findUnique({
      where: { id },
    });

    if (!existingGrade) {
      return errorResponse(res, 'Data nilai tidak ditemukan.', 404, 'GRADE_NOT_FOUND');
    }

    await prisma.grade.delete({ where: { id } });

    return successResponse(res, 'Data nilai berhasil dihapus.', { id });
  } catch (error) {
    console.error('[Delete Grade Error]:', error);
    return errorResponse(res, 'Gagal menghapus data nilai.', 500, 'DELETE_GRADE_ERROR');
  }
};
