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
  ArrowUpRight,
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
    if (score >= 90) return { label: 'Sangat Baik (A)', color: 'bg-teal-50 text-teal-700 border-teal-200' };
    if (score >= 80) return { label: 'Baik (B)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (score >= 70) return { label: 'Cukup (C)', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'Perlu Bimbingan (D)', color: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  /* =========================================================================
     VIEW UNTUK SISWA (Card Rapor Anti-Gravity Hover Effect)
     ========================================================================= */
  if (isStudent) {
    if (loadingStudentData) {
      return (
        <div className="space-y-8 animate-pulse p-4">
          <div className="h-36 bg-slate-200/80 rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-56 bg-slate-200/80 rounded-3xl" />
            ))}
          </div>
        </div>
      );
    }

    if (studentError) {
      return (
        <div className="bg-rose-50 border border-rose-200 p-8 rounded-3xl text-rose-700 font-semibold text-sm">
          Gagal mengambil data rapor nilai. Silakan muat ulang halaman.
        </div>
      );
    }

    const gradesList = studentData?.grades || [];

    return (
      <div className="space-y-12 max-w-6xl mx-auto py-2">
        
        {/* Banner Profil Siswa dengan Gradien Halus */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white p-8 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] border border-teal-700/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-bold text-3xl border border-white/20">
                <User className="w-9 h-9 text-teal-200" />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-teal-200 uppercase font-bold tracking-widest block">Rapor Hasil Belajar</span>
                <h2 className="text-3xl font-extrabold tracking-tight">{studentData?.student?.name}</h2>
                <p className="text-xs text-teal-100 font-medium">
                  NISN: <span className="font-mono font-bold">{studentData?.student?.nisn || '-'}</span> • Kelas: <span className="font-bold">{studentData?.student?.class || '1A'}</span>
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-8 py-5 rounded-2xl border border-white/20 text-center">
              <span className="text-[11px] text-teal-200 font-semibold uppercase tracking-wider block">Indeks Prestasi</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-white">{studentData?.summary?.averageScore || 0}</span>
            </div>
          </div>
        </div>

        {/* Section Cards Nilai Anti-Gravity */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-500" /> Rapor Nilai Mata Pelajaran
              </h3>
              <p className="text-xs text-slate-500 mt-1">Arahkan kursor untuk merasakan efek Anti-Gravity</p>
            </div>
            <span className="text-xs text-slate-500 font-bold bg-slate-100 px-3.5 py-1.5 rounded-full">
              {gradesList.length} Mata Pelajaran
            </span>
          </div>

          {gradesList.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center text-slate-400 text-sm border border-slate-100 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)]">
              Belum ada data nilai yang diinputkan untuk akun Anda pada semester ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gradesList.map((g) => {
                const pred = getPredicate(g.score);
                return (
                  <FloatingCard
                    key={g.id}
                    isStatic={true}
                    className="p-8 bg-white rounded-3xl border border-slate-100 hover:border-teal-200 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {g.semester} • {g.academic_year}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${pred.color}`}>
                          {pred.label}
                        </span>
                      </div>

                      <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">{g.subject}</h4>
                    </div>

                    <div className="pt-8 mt-6 border-t border-slate-100 flex items-end justify-between">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nilai Capaian</span>
                      <span className="text-4xl font-extrabold text-teal-600 leading-none">{g.score}</span>
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
    <div className="space-y-8 max-w-7xl mx-auto py-2">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)]">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Award className="w-7 h-7 text-teal-500" /> Penilaian Akademik SIAKAD
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Input dan manajemen rekapitulasi nilai siswa SDN 2 Tegalsari Kepanjen
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-7 py-3 shadow-[0_8px_20px_rgba(20,184,166,0.3)] transition-all font-bold text-xs flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Input Nilai Baru
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold rounded-2xl flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-teal-600 font-bold">✕</button>
        </div>
      )}

      {/* Tabel Murid dan Nilai */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-base tracking-tight">Daftar Nilai Siswa (Total: {allGrades.length})</h3>
        </div>

        {loadingGrades ? (
          <div className="p-16 text-center text-slate-400 text-sm animate-pulse">Memuat daftar nilai...</div>
        ) : allGrades.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-sm">Belum ada nilai terdaftar.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6 sm:px-8">Nama Siswa</th>
                  <th className="py-4 px-6">Mata Pelajaran</th>
                  <th className="py-4 px-6">Nilai</th>
                  <th className="py-4 px-6">Semester</th>
                  <th className="py-4 px-6">Tahun Ajaran</th>
                  <th className="py-4 px-6 sm:px-8 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {allGrades.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-5 px-6 sm:px-8 font-bold text-slate-900">{g.student?.name || 'Siswa'}</td>
                    <td className="py-5 px-6 text-slate-600">{g.subject}</td>
                    <td className="py-5 px-6 font-extrabold text-teal-600 text-base">{g.score}</td>
                    <td className="py-5 px-6 text-slate-500">{g.semester}</td>
                    <td className="py-5 px-6 text-slate-500">{g.academic_year}</td>
                    <td className="py-5 px-6 sm:px-8 text-right">
                      <button
                        onClick={() => {
                          if (window.confirm('Apakah Anda yakin ingin menghapus data nilai ini?')) {
                            deleteGradeMutation.mutate(g.id);
                          }
                        }}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
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
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 relative border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">Form Input Nilai Siswa</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Pilih Murid</label>
                <select
                  required
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-500 font-medium"
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
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Mata Pelajaran</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Misal: Matematika, IPAS, Bahasa Indonesia"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Nilai Angka (0 - 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  required
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                  placeholder="88.5"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium"
                  >
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Tahun Ajaran</label>
                  <input
                    type="text"
                    required
                    value={formData.academic_year}
                    onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                    placeholder="2024/2025"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-full"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={createGradeMutation.isPending}
                  className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-7 py-3 shadow-[0_8px_20px_rgba(20,184,166,0.3)] transition-all font-bold text-xs disabled:opacity-50 active:scale-95"
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
