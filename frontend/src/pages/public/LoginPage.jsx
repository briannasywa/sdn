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

  // Quick Demo Account Auto-Fill Helper
  const fillCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background Anti-Gravity levitating glowing shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <Link to="/" className="flex items-center gap-3 mb-8 group">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xl group-hover:scale-105 transition-transform">
          <GraduationCap className="w-7 h-7" />
        </div>
        <div>
          <span className="font-extrabold text-2xl text-white block">SDN 2 Tegalsari</span>
          <span className="text-xs text-emerald-400 font-semibold tracking-wider block">PORTAL SIAKAD DIGITAL</span>
        </div>
      </Link>

      {/* Anti-Gravity Floating Login Card */}
      <FloatingCard duration={6} glow={true} className="w-full max-w-md bg-white/95 border-emerald-100 shadow-float-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Masuk ke Akun Anda</h2>
          <p className="text-xs text-slate-500 mt-1">
            Sistem Informasi Akademik dengan Role-Based Access Control
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@sdn2tegalsari.sch.id"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-md hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isLoading ? 'Memproses Login...' : 'Masuk SIAKAD'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Quick Fill Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 space-y-2">
          <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block text-center">
            Uji Coba Demo Akun (Klik untuk Isi Otomatis)
          </span>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('admin@sdn2tegalsari.sch.id', 'AdminSecure2026!')}
              className="px-2 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Admin
            </button>

            <button
              type="button"
              onClick={() => fillCredentials('guru@sdn2tegalsari.sch.id', 'GuruSecure2026!')}
              className="px-2 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-600" /> Guru
            </button>

            <button
              type="button"
              onClick={() => fillCredentials('siswa@sdn2tegalsari.sch.id', 'SiswaSecure2026!')}
              className="px-2 py-1.5 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1"
            >
              <Key className="w-3.5 h-3.5 text-amber-600" /> Siswa
            </button>
          </div>
        </div>
      </FloatingCard>

      <div className="mt-6 text-center text-xs text-slate-400">
        <Link to="/" className="hover:text-emerald-400 transition-colors">
          ← Kembali ke Beranda Utama
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
