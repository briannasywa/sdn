import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/useAuthStore';
import FloatingCard from '../../components/common/FloatingCard';
import api from '../../api/axios';
import {
  Award,
  BookOpen,
  Plus,
  Trash2,
  TrendingUp,
  User,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';

export const GradesPage = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const isStudent = user?.role === 'STUDENT';

  // Teacher / Admin Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    studentId: '',
    subject: 'Matematika',
    score: '',
    semester: 'Ganjil',
    academic_year: '2024/2025',
  });

  // 1. STUDENT QUERY: Fetch My Grades
  const {
    data: studentData,
    isLoading: loadingStudentData,
    error: studentError,
  } = useQuery({
    queryKey: ['myGrades'],
    queryFn: async () => {
      const res = await api.get('/grades/my-grades');
      return res.data.data;
    },
    enabled: isStudent,
  });

  // 2. TEACHER / ADMIN QUERY: Fetch All Grades & Students
  const { data: allGrades = [], isLoading: loadingGrades } = useQuery({
    queryKey: ['allGrades'],
    queryFn: async () => {
      const res = await api.get('/grades');
      return res.data.data.grades;
    },
    enabled: !isStudent,
  });

  const { data: studentList = [] } = useQuery({
    queryKey: ['studentList'],
    queryFn: async () => {
      const res = await api.get('/academic/students');
      return res.data.data;
    },
    enabled: !isStudent,
  });

  // 3. MUTATION: Input Grade
  const createGradeMutation = useMutation({
    mutationFn: async (newGrade) => {
      const res = await api.post('/grades', newGrade);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allGrades']);
      setSuccessMsg('Nilai siswa berhasil disimpan!');
      setModalOpen(false);
      setFormData({
        studentId: '',
        subject: 'Matematika',
        score: '',
        semester: 'Ganjil',
        academic_year: '2024/2025',
      });
    },
    onError: (err) => {
      setErrorMsg(err.response?.data?.message || 'Gagal menyimpan nilai.');
    },
  });

  // MUTATION: Delete Grade
  const deleteGradeMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/grades/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allGrades']);
      setSuccessMsg('Nilai berhasil dihapus.');
    },
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    createGradeMutation.mutate(formData);
  };

  const getPredicate = (score) => {
    if (score >= 90) return { label: 'Sangat Baik (A)', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    if (score >= 80) return { label: 'Baik (B)', color: 'bg-teal-100 text-teal-800 border-teal-200' };
    if (score >= 70) return { label: 'Cukup (C)', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    return { label: 'Perlu Bimbingan (D)', color: 'bg-rose-100 text-rose-800 border-rose-200' };
  };

  /* =========================================================================
     VIEW UNTUK SISWA (Card Rapor Anti-Gravity Hover Effect)
     ========================================================================= */
  if (isStudent) {
    if (loadingStudentData) {
      return (
        <div className="space-y-6 animate-pulse">
          <div className="h-32 bg-slate-200 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        </div>
      );
    }

    if (studentError) {
      return (
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-rose-700 font-semibold text-sm">
          Gagal mengambil data rapor nilai. Silakan coba lagi.
        </div>
      );
    }

    const gradesList = studentData?.grades || [];

    return (
      <div className="space-y-10 max-w-6xl mx-auto">
        {/* Banner Profil Siswa */}
        <FloatingCard duration={6} interactiveHover={false} className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-8 rounded-3xl border-none shadow-float-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-bold text-3xl border border-white/20">
                <User className="w-9 h-9" />
              </div>
              <div>
                <span className="text-xs text-emerald-200 uppercase font-bold tracking-widest block">Rapor Digital Siswa</span>
                <h2 className="text-3xl font-extrabold">{studentData?.student?.name}</h2>
                <p className="text-xs text-emerald-100 mt-1">
                  NISN: <span className="font-mono font-bold">{studentData?.student?.nisn || '-'}</span> • Kelas: <span className="font-bold">{studentData?.student?.class || '1A'}</span>
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center">
              <span className="text-[11px] text-emerald-200 font-semibold uppercase tracking-wider block">Rata-Rata Nilai</span>
              <span className="text-3xl font-extrabold text-white">{studentData?.summary?.averageScore || 0}</span>
            </div>
          </div>
        </FloatingCard>

        {/* Section Cards Nilai Anti-Gravity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" /> Rapor Mata Pelajaran (Anti-Gravity Cards)
            </h3>
            <span className="text-xs text-slate-500 font-medium">Total: {gradesList.length} Mata Pelajaran</span>
          </div>

          {gradesList.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-500 text-sm border border-slate-200">
              Belum ada data nilai yang diinputkan untuk semester ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gradesList.map((g, idx) => {
                const pred = getPredicate(g.score);
                return (
                  <FloatingCard
                    key={g.id}
                    duration={5}
                    delay={idx * 0.15}
                    glow={g.score >= 90}
                    className="p-6 bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {g.semester} • {g.academic_year}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${pred.color}`}>
                          {pred.label}
                        </span>
                      </div>

                      <h4 className="text-xl font-extrabold text-slate-900">{g.subject}</h4>
                    </div>

                    <div className="pt-6 mt-4 border-t border-slate-100 flex items-end justify-between">
                      <span className="text-xs font-semibold text-slate-500">Nilai Akhir</span>
                      <span className="text-3xl font-extrabold text-emerald-600 leading-none">{g.score}</span>
                    </div>
                  </FloatingCard>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* =========================================================================
     VIEW UNTUK GURU / ADMIN (Tabel Murid & Form Input Nilai)
     ========================================================================= */
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-600" /> Manajemen Penilaian Akademik Guru & Admin
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Input dan kelola daftar nilai seluruh siswa SDN 2 Tegalsari Kepanjen
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Input Nilai Baru
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-600 font-bold">✕</button>
        </div>
      )}

      {/* Tabel Murid dan Nilai */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Daftar Nilai Siswa (Total: {allGrades.length})</h3>
        </div>

        {loadingGrades ? (
          <div className="p-12 text-center text-slate-400 text-sm animate-pulse">Memuat daftar nilai...</div>
        ) : allGrades.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">Belum ada nilai terdaftar.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Nama Siswa</th>
                  <th className="py-4 px-6">Mata Pelajaran</th>
                  <th className="py-4 px-6">Nilai</th>
                  <th className="py-4 px-6">Semester</th>
                  <th className="py-4 px-6">Tahun Ajaran</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {allGrades.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{g.student?.name || 'Siswa'}</td>
                    <td className="py-4 px-6">{g.subject}</td>
                    <td className="py-4 px-6 font-extrabold text-emerald-600 text-base">{g.score}</td>
                    <td className="py-4 px-6">{g.semester}</td>
                    <td className="py-4 px-6">{g.academic_year}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => {
                          if (window.confirm('Apakah Anda yakin ingin menghapus data nilai ini?')) {
                            deleteGradeMutation.mutate(g.id);
                          }
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Nilai"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL FORM INPUT NILAI */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 relative border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-lg">Form Input Nilai Siswa</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pilih Murid</label>
                <select
                  required
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Pilih Murid --</option>
                  {studentList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mata Pelajaran</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Misal: Matematika, IPAS, Bahasa Indonesia"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nilai Angka (0 - 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  required
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                  placeholder="88.5"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tahun Ajaran</label>
                  <input
                    type="text"
                    required
                    value={formData.academic_year}
                    onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                    placeholder="2024/2025"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={createGradeMutation.isPending}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow disabled:opacity-50"
                >
                  {createGradeMutation.isPending ? 'Menyimpan...' : 'Simpan Nilai'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradesPage;
