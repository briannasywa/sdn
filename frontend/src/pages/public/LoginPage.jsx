import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import FloatingCard from '../../components/common/FloatingCard';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Key } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    }
  };

  const fillCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/70 via-slate-50 to-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      {/* Soft Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <Link to="/" className="flex items-center gap-3.5 mb-10 group">
        <div className="w-12 h-12 rounded-2xl bg-teal-500 flex items-center justify-center text-white shadow-[0_8px_20px_rgba(20,184,166,0.3)] group-hover:scale-105 transition-transform duration-300">
          <GraduationCap className="w-7 h-7" />
        </div>
        <div>
          <span className="font-extrabold text-2xl text-slate-900 tracking-tight block leading-tight">
            SDN 2 Tegalsari
          </span>
          <span className="text-xs text-teal-600 font-bold tracking-wider block">
            PORTAL AKADEMIK (SIAKAD)
          </span>
        </div>
      </Link>

      {/* Anti-Gravity Floating Login Card */}
      <FloatingCard duration={5} glow={true} className="w-full max-w-md bg-white border-slate-100 p-8 sm:p-10 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Masuk ke SIAKAD</h2>
          <p className="text-sm text-slate-500 mt-1.5 font-normal">
            Sistem Informasi Akademik SDN 2 Tegalsari Kepanjen
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Alamat Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@sdn2tegalsari.sch.id"
                className="w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-medium"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-medium"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-full shadow-[0_8px_20px_rgba(20,184,166,0.3)] hover:shadow-[0_12px_28px_rgba(20,184,166,0.4)] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 active:scale-95"
          >
            {isLoading ? 'Memproses...' : 'Masuk Sekarang'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Accounts Quick-Fill Section */}
        <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
          <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block text-center">
            Pilihan Akun Demo (Klik untuk Isi)
          </span>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => fillCredentials('admin@sdn2tegalsari.sch.id', 'AdminSecure2026!')}
              className="px-3 py-2 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 text-slate-600 text-xs font-bold rounded-xl border border-slate-200/80 transition-all flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Admin
            </button>

            <button
              type="button"
              onClick={() => fillCredentials('guru@sdn2tegalsari.sch.id', 'GuruSecure2026!')}
              className="px-3 py-2 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 text-slate-600 text-xs font-bold rounded-xl border border-slate-200/80 transition-all flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-600" /> Guru
            </button>

            <button
              type="button"
              onClick={() => fillCredentials('siswa@sdn2tegalsari.sch.id', 'SiswaSecure2026!')}
              className="px-3 py-2 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 text-slate-600 text-xs font-bold rounded-xl border border-slate-200/80 transition-all flex items-center justify-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5 text-amber-500" /> Siswa
            </button>
          </div>
        </div>
      </FloatingCard>

      <div className="mt-8 text-center text-xs text-slate-500 font-medium">
        <Link to="/" className="hover:text-teal-600 transition-colors">
          ← Kembali ke Halaman Utama
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
