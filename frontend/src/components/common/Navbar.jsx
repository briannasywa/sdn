import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { GraduationCap, LogIn, LayoutDashboard, LogOut, Menu, X, BookOpen, Newspaper, Home, Award } from 'lucide-react';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', path: '/', icon: Home },
    { name: 'Profil Sekolah', path: '/#profil', icon: BookOpen },
    { name: 'Berita & Artikel', path: '/berita', icon: Newspaper },
    { name: 'Keunggulan', path: '/#keunggulan', icon: Award },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md shadow-sm border-b border-emerald-100/60 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-lg text-slate-900 block leading-tight group-hover:text-emerald-600 transition-colors">
              SDN 2 Tegalsari
            </span>
            <span className="text-xs text-emerald-700 font-medium tracking-wide block">
              Kepanjen, Kab. Malang
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/60 backdrop-blur-sm p-1.5 rounded-full border border-slate-200/50">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-emerald-700 hover:bg-white/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-emerald-500/25 hover:scale-105 transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                SIAKAD ({user?.role})
              </Link>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 bg-slate-900 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-md hover:shadow-emerald-900/20 transition-all hover:scale-105"
            >
              <LogIn className="w-4 h-4" />
              Masuk SIAKAD
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 px-4 pt-3 pb-6 mt-2 shadow-lg">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-slate-800 font-medium hover:bg-emerald-50 hover:text-emerald-700"
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
                    className="w-full bg-emerald-600 text-white py-2.5 rounded-xl text-center font-semibold"
                  >
                    Buka SIAKAD ({user?.role})
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-rose-50 text-rose-600 py-2.5 rounded-xl font-semibold"
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-center font-semibold block"
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
