import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { GraduationCap, LogIn, LayoutDashboard, LogOut, Menu, X, BookOpen, Newspaper, Home, Award } from 'lucide-react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();

  const navLinks = [
    { name: 'Beranda', path: '/', icon: Home },
    { name: 'Profil & Visi', path: '/#visi-misi', icon: BookOpen },
    { name: 'Berita Sekolah', path: '/berita', icon: Newspaper },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-[0_8px_16px_rgba(20,184,166,0.25)] group-hover:scale-105 transition-transform duration-300">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-slate-900 tracking-tight block leading-tight group-hover:text-teal-600 transition-colors">
              SDN 2 Tegalsari
            </span>
            <span className="text-xs text-slate-500 font-medium block">
              Kepanjen, Kab. Malang
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 bg-slate-50/80 p-1.5 rounded-full border border-slate-200/60">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'bg-white text-teal-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className="w-4 h-4 text-teal-500" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Auth Button */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-6 py-2.5 shadow-[0_8px_20px_rgba(20,184,166,0.3)] transition-all font-bold text-sm flex items-center gap-2 active:scale-95"
              >
                <LayoutDashboard className="w-4 h-4" />
                SIAKAD ({user?.role})
              </Link>
              <button
                onClick={logout}
                title="Logout"
                className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-7 py-3 shadow-[0_8px_20px_rgba(20,184,166,0.3)] hover:shadow-[0_12px_28px_rgba(20,184,166,0.4)] transition-all font-bold text-sm flex items-center gap-2 active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              Masuk SIAKAD
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-5 pt-3 pb-6 shadow-xl">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-2xl text-slate-700 font-semibold hover:bg-teal-50 hover:text-teal-700 text-sm transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100 mt-2">
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full bg-teal-500 text-white py-3 rounded-full text-center font-bold text-sm shadow-[0_8px_20px_rgba(20,184,166,0.3)] block"
                  >
                    Buka SIAKAD ({user?.role})
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-rose-50 text-rose-600 py-3 rounded-full font-bold text-sm"
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-teal-500 text-white py-3 rounded-full text-center font-bold text-sm shadow-[0_8px_20px_rgba(20,184,166,0.3)] block"
                >
                  Masuk SIAKAD
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
