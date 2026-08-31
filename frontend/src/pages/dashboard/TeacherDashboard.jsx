import { useEffect, useState } from 'react';
import api from '../../api/axios';
import FloatingCard from '../../components/common/FloatingCard';
import { Award, Plus, Edit, Trash2, Users, Search, CheckCircle2, X } from 'lucide-react';

export const TeacherDashboard = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form state for input grade
  const [formData, setFormData] = useState({
    studentId: '',
    subject: 'Matematika',
    score: '',
    semester: 'Ganjil',
    academic_year: '2024/2025',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [gradesRes, studentsRes] = await Promise.all([
        api.get('/grades'),
        api.get('/academic/students'),
      ]);
      if (gradesRes.data.success) setGrades(gradesRes.data.data.grades);
      if (studentsRes.data.success) setStudents(studentsRes.data.data);
    } catch (err) {
      console.error('Failed to fetch teacher dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateGrade = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.post('/grades', formData);
      if (res.data.success) {
        setSuccessMsg('Nilai siswa berhasil disimpan!');
        setModalOpen(false);
        setFormData({
          studentId: '',
          subject: 'Matematika',
          score: '',
          semester: 'Ganjil',
          academic_year: '2024/2025',
        });
        fetchData();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Gagal menyimpan nilai.');
    }
  };

  const handleDeleteGrade = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data nilai ini?')) return;
    try {
      const res = await api.delete(`/grades/${id}`);
      if (res.data.success) {
        setSuccessMsg('Nilai berhasil dihapus.');
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus nilai.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-600" /> Manajemen & Input Nilai SIAKAD
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Kelola penilaian akademik seluruh siswa SDN 2 Tegalsari Kepanjen
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105"
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

      {/* Grades Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Daftar Nilai Siswa (Total: {grades.length})</h3>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm animate-pulse">Memuat data nilai...</div>
        ) : grades.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">Belum ada nilai terdaftar.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Nama Siswa</th>
                  <th className="py-3.5 px-6">Mata Pelajaran</th>
                  <th className="py-3.5 px-6">Nilai</th>
                  <th className="py-3.5 px-6">Semester</th>
                  <th className="py-3.5 px-6">Tahun Ajaran</th>
                  <th className="py-3.5 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {grades.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{g.student?.name || 'Siswa'}</td>
                    <td className="py-4 px-6">{g.subject}</td>
                    <td className="py-4 px-6 font-extrabold text-emerald-600">{g.score}</td>
                    <td className="py-4 px-6">{g.semester}</td>
                    <td className="py-4 px-6">{g.academic_year}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleDeleteGrade(g.id)}
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

      {/* INPUT GRADE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 relative border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-lg">Input Nilai Siswa Baru</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pilih Siswa</label>
                <select
                  required
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Pilih Siswa --</option>
                  {students.map((s) => (
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
                  placeholder="Misal: Matematika, Bahasa Indonesia"
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
                  placeholder="85.5"
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

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
                >
                  Simpan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
