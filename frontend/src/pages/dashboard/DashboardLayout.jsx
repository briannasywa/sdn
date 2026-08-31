import { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
  GraduationCap,
  LayoutDashboard,
  Award,
  FileText,
  Users,
  LogOut,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  BookOpen,
} from 'lucide-react';

export const DashboardLayout = () => {
  const { user, isAuthenticated, logout, fetchMe } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchMe();
    }
  }, [isAuthenticated, navigate, fetchMe]);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Sidebar navigation menu per Role
  const getNavItems = () => {
    if (user.role === 'STUDENT') {
      return [
        { name: 'Nilai & Laporan Saya', path: '/dashboard', icon: Award },
        { name: 'Profil Siswa', path: '/dashboard/profile', icon: Users },
      ];
    }
    if (user.role === 'TEACHER') {
      return [
        { name: 'Input & Kelola Nilai', path: '/dashboard', icon: Award },
        { name: 'Daftar Siswa & Kelas', path: '/dashboard/students', icon: Users },
      ];
    }
    // ADMIN
    return [
      { name: 'Input & Kelola Nilai', path: '/dashboard', icon: Award },
      { name: 'Kelola Berita (CMS)', path: '/dashboard/posts', icon: FileText },
      { name: 'Daftar Siswa & Kelas', path: '/dashboard/students', icon: Users },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800 hidden md:flex">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-sm text-white block">SIAKAD Digital</span>
            <span className="text-[11px] text-emerald-400 font-semibold block">SDN 2 Tegalsari</span>
          </div>
        </div>

        {/* User Card Badge */}
        <div className="p-4 mx-4 my-4 bg-slate-800/80 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <span className="font-bold text-xs text-white block truncate">{user.name}</span>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase px-2 py-0.5 bg-emerald-950 rounded-md border border-emerald-800 inline-block mt-0.5">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5 flex-grow">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800/60 text-slate-300 text-xs font-medium hover:bg-slate-800"
          >
            <span>Kembali ke Website</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950/60 text-rose-300 text-xs font-bold hover:bg-rose-900 border border-rose-800/50 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Keluar Sistem
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-emerald-600" />
            <h1 className="font-bold text-slate-900 text-base">Dashboard SIAKAD ({user.role})</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500 hidden sm:inline-block">
              Login sebagai: <strong className="text-slate-800">{user.email}</strong>
            </span>
            <button
              onClick={logout}
              className="md:hidden px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" /> Keluar
            </button>
          </div>
        </header>

        {/* Outlet Page Container */}
        <main className="p-6 flex-grow overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
