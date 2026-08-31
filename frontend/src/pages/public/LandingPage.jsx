import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import FloatingCard from '../../components/common/FloatingCard';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import api from '../../api/axios';
import {
  Sparkles,
  BookOpen,
  Award,
  Users,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Newspaper,
  Calendar,
  User,
  GraduationCap,
  Building2,
} from 'lucide-react';

export const LandingPage = () => {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -60]);

  // Fetch Latest Posts using React Query
  const { data: posts = [], isLoading: loadingPosts } = useQuery({
    queryKey: ['latestPosts'],
    queryFn: async () => {
      const res = await api.get('/posts?limit=3');
      return res.data.data.posts;
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />

      {/* HERO SECTION WITH FRAMER-MOTION PARALLAX & ANTI-GRAVITY FLOATING CARDS */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-36 overflow-hidden bg-gradient-to-b from-emerald-50/80 via-slate-50 to-slate-50">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl -z-10 animate-pulse-subtle" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Parallax Left Content */}
            <motion.div style={{ y: heroY }} className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-sm font-semibold shadow-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Portal Resmi SDN 2 Tegalsari Kepanjen</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
                Pendidikan Unggul, <br />
                <span className="text-gradient">Berkarakter & Digital</span>
              </h1>

              <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
                Selamat datang di platform SDN 2 Tegalsari Kepanjen. Menggabungkan Company Profile modern berkonsep Anti-Gravity dengan Sistem Informasi Akademik (SIAKAD) yang aman dan terintegrasi.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/login"
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:scale-105 transition-all flex items-center gap-2 text-base"
                >
                  Masuk SIAKAD <ChevronRight className="w-5 h-5" />
                </Link>

                <a
                  href="#visi-misi"
                  className="px-8 py-4 rounded-full bg-white text-slate-700 font-semibold border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-emerald-300 transition-all text-base"
                >
                  Lihat Visi & Misi
                </a>
              </div>

              {/* Badges */}
              <div className="pt-8 border-t border-slate-200/80 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-semibold text-slate-700">NPSN: 20517647</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-semibold text-slate-700">Akreditasi A</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-semibold text-slate-700">Kurikulum Merdeka</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-semibold text-slate-700">Protected DevSecOps</span>
                </div>
              </div>
            </motion.div>

            {/* Anti-Gravity Levitation Cards */}
            <div className="lg:col-span-5 relative min-h-[440px] flex items-center justify-center">
              <FloatingCard duration={6} yDistance={-15} glow={true} className="w-full max-w-sm z-20">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase">
                    Portal SIAKAD
                  </span>
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Transkrip & Rapor Digital</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Memudahkan Siswa dan Wali Murid memantau hasil belajar secara transparan & real-time.
                </p>
                <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between text-xs font-semibold text-slate-700 border border-slate-100">
                  <span>Keamanan Data</span>
                  <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Enkripsi JWT</span>
                </div>
              </FloatingCard>

              {/* Floating Orbit 1 */}
              <FloatingCard
                duration={5}
                delay={1}
                yDistance={-12}
                className="absolute -top-4 -right-2 z-30 w-52 p-4 bg-white/95 shadow-float-lg border-teal-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 font-medium">Prestasi</span>
                    <span className="block text-sm font-bold text-slate-900">Sekolah Penggerak</span>
                  </div>
                </div>
              </FloatingCard>

              {/* Floating Orbit 2 */}
              <FloatingCard
                duration={7}
                delay={2}
                yDistance={-16}
                className="absolute -bottom-6 -left-2 z-30 w-56 p-4 bg-white/95 shadow-float-lg border-emerald-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 font-medium">Pengajar Terbaik</span>
                    <span className="block text-sm font-bold text-slate-900">Guru Berlisensi</span>
                  </div>
                </div>
              </FloatingCard>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTIK SEKOLAH */}
      <section className="py-12 bg-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <span className="block text-4xl font-extrabold text-emerald-600 mb-1">450+</span>
              <span className="text-sm font-semibold text-slate-600">Siswa Aktif</span>
            </div>
            <div className="p-4">
              <span className="block text-4xl font-extrabold text-teal-600 mb-1">24</span>
              <span className="text-sm font-semibold text-slate-600">Guru & Pengajar</span>
            </div>
            <div className="p-4">
              <span className="block text-4xl font-extrabold text-amber-500 mb-1">12</span>
              <span className="text-sm font-semibold text-slate-600">Ruang Kelas Nyaman</span>
            </div>
            <div className="p-4">
              <span className="block text-4xl font-extrabold text-slate-900 mb-1">Akreditasi A</span>
              <span className="text-sm font-semibold text-slate-600">Predikat Unggul</span>
            </div>
          </div>
        </div>
      </section>

      {/* BAGIAN VISI MISI */}
      <section id="visi-misi" className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs uppercase tracking-widest font-extrabold text-emerald-700">Profil Sekolah</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Visi & Misi SDN 2 Tegalsari Kepanjen
            </p>
            <p className="text-slate-600 text-base">
              Menjadi lembaga pendidikan dasar unggulan yang membentuk karakter berakhlak mulia dan berwawasan digital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FloatingCard duration={6} delay={0.2} interactiveHover={false} className="bg-white p-8 border-l-4 border-l-emerald-600">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6 font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Visi Utama</h3>
              <p className="text-slate-600 leading-relaxed italic text-lg">
                "Terwujudnya Peserta Didik yang Bertaqwa, Berkarakter Pancasila, Cerdas, Berprestasi, dan Berwawasan Lingkungan Global."
              </p>
            </FloatingCard>

            <FloatingCard duration={6} delay={0.4} interactiveHover={false} className="bg-white p-8 border-l-4 border-l-teal-600">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-6 font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Misi Pendidikan</h3>
              <ul className="space-y-3.5 text-slate-600 text-sm font-medium">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <span>Menyelenggarakan pembelajaran berkualitas sesuai Kurikulum Merdeka.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <span>Membentuk sikap religius, disiplin, dan menghormati sesama.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <span>Mengembangkan SIAKAD digital untuk kemudahan layanan akademik siswa.</span>
                </li>
              </ul>
            </FloatingCard>
          </div>
        </div>
      </section>

      {/* BAGIAN BERITA TERBARU (REACT QUERY FETCH) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-700">Informasi & Pengumuman</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Berita Terbaru Sekolah</h2>
            </div>
            <Link
              to="/berita"
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 hover:gap-2 transition-all text-sm"
            >
              Lihat Berita Lainnya <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingPosts ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-slate-50 rounded-2xl p-12 text-center text-slate-500">
              Belum ada berita dipublikasikan saat ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map((post, idx) => (
                <FloatingCard
                  key={post.id}
                  duration={5}
                  delay={idx * 0.2}
                  className="p-0 overflow-hidden flex flex-col h-full bg-white border-slate-200/80"
                >
                  <div className="h-48 bg-slate-100 overflow-hidden relative">
                    <img
                      src={post.image_url || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80'}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full shadow-sm">
                      Kabar Sekolah
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        {new Date(post.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-emerald-600" />
                        {post.author?.name || 'Admin'}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 hover:text-emerald-700 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-grow">
                      {post.content}
                    </p>
                    <Link
                      to={`/berita/${post.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-800"
                    >
                      Baca Selengkapnya <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </FloatingCard>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA FOOTER BANNER */}
      <section className="py-20 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Akses Layanan Akademik Digital SIAKAD</h2>
          <p className="text-emerald-100 max-w-2xl mx-auto text-base">
            Masuk dengan akun Siswa, Guru, atau Admin untuk mengakses transkrip nilai dan pengelolaan data sekolah.
          </p>
          <div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-emerald-900 font-bold hover:bg-emerald-50 transition-all hover:scale-105 shadow-xl text-base"
            >
              Masuk ke SIAKAD <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
