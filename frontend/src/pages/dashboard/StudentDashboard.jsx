import { useEffect, useState } from 'react';
import api from '../../api/axios';
import FloatingCard from '../../components/common/FloatingCard';
import { Award, BookOpen, User, Calendar, CheckCircle2, TrendingUp } from 'lucide-react';

export const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyGrades = async () => {
      try {
        const res = await api.get('/grades/my-grades');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal memuat data nilai.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyGrades();
  }, []);

  const getPredicate = (score) => {
    if (score >= 90) return { label: 'Sangat Baik (A)', color: 'bg-emerald-100 text-emerald-800' };
    if (score >= 80) return { label: 'Baik (B)', color: 'bg-teal-100 text-teal-800' };
    if (score >= 70) return { label: 'Cukup (C)', color: 'bg-amber-100 text-amber-800' };
    return { label: 'Perlu Bimbingan (D)', color: 'bg-rose-100 text-rose-800' };
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-slate-200 rounded-2xl" />
        <div className="h-64 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-rose-700 text-sm font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Student Profile & Summary Floating Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Student Info */}
        <FloatingCard duration={6} interactiveHover={false} className="md:col-span-2 bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 rounded-2xl border-none">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-bold text-2xl border border-white/20">
              <User className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs text-emerald-200 uppercase font-semibold tracking-wider">Laporan Hasil Belajar Siswa</span>
              <h2 className="text-2xl font-bold">{data?.student?.name}</h2>
              <div className="flex items-center gap-4 text-xs text-emerald-100 mt-1">
                <span>NISN: {data?.student?.nisn || '-'}</span>
                <span>•</span>
                <span>Kelas: {data?.student?.class || '1A'}</span>
              </div>
            </div>
          </div>
        </FloatingCard>

        {/* GPA / Average Score Card */}
        <FloatingCard duration={5} delay={0.2} glow={true} className="bg-white p-6 rounded-2xl border-emerald-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rata-Rata Nilai</span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-4xl font-extrabold text-emerald-600 block">
            {data?.summary?.averageScore || 0}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            Dari total {data?.summary?.totalSubjects || 0} Mata Pelajaran
          </span>
        </FloatingCard>
      </div>

      {/* Grades Report Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" /> Transkrip Rapor Nilai
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Daftar capaian akademik semester berjalan</p>
          </div>
        </div>

        {data?.grades?.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            Belum ada nilai yang dimasukkan oleh guru untuk akun ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Mata Pelajaran</th>
                  <th className="py-3.5 px-6">Nilai Angka</th>
                  <th className="py-3.5 px-6">Predikat</th>
                  <th className="py-3.5 px-6">Semester</th>
                  <th className="py-3.5 px-6">Tahun Ajaran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {data?.grades?.map((g) => {
                  const pred = getPredicate(g.score);
                  return (
                    <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">{g.subject}</td>
                      <td className="py-4 px-6 text-emerald-600 font-extrabold text-base">{g.score}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${pred.color}`}>
                          {pred.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">{g.semester}</td>
                      <td className="py-4 px-6">{g.academic_year}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
