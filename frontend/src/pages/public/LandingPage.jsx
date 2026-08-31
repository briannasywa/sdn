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
  Calendar,
  User,
  GraduationCap,
  Building2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const LandingPage = () => {
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 600], [0, -40]);

  // Fetch Latest Posts with React Query
  const { data: posts = [], isLoading: loadingPosts } = useQuery({
    queryKey: ['landingLatestPosts'],
    queryFn: async () => {
      const res = await api.get('/posts?limit=3');
      return res.data.data.posts;
    },
  });

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      <Navbar />

      {/* 1. HERO SECTION WITH SUPER SOFT GRADIENT & ANTI-GRAVITY FLOATING ELEMENTS */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-36 bg-gradient-to-b from-teal-50/50 to-white overflow-hidden">
        {/* Soft Ambient Blur Orbs */}
        <div className="absolute top-12 left-1/3 w-[500px] h-[500px] bg-teal-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-36 right-10 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content Column */}
            <motion.div style={{ y: heroParallax }} className="lg:col-span-7 space-y-8">
              
              {/* Badge Accent Kecil */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-200/60 text-teal-700 text-xs font-bold tracking-wide shadow-xs">
                <Sparkles className="w-4 h-4 text-teal-500" />
                <span>Solusi Pendidikan Modern</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.12] tracking-tight">
                Membangun Generasi <br />
                <span className="text-gradient">Cerdas & Berkarakter</span>
              </h1>

              {/* Subheading */}
              <p className="text-slate-500 text-lg sm:text-xl leading-relaxed max-w-2xl font-normal">
                Selamat datang di portal resmi SDN 2 Tegalsari Kepanjen. Menghadirkan lingkungan belajar unggulan dengan sistem informasi akademik (SIAKAD) modern dan terintegrasi.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/login"
                  className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-8 py-3.5 shadow-[0_8px_20px_rgba(20,184,166,0.3)] hover:shadow-[0_12px_28px_rgba(20,184,166,0.4)] transition-all font-bold text-base flex items-center gap-2 active:scale-95"
                >
                  Masuk SIAKAD <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href="#visi-misi"
                  className="bg-white hover:bg-slate-50 text-slate-700 rounded-full px-8 py-3.5 border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:border-teal-300 transition-all font-bold text-base flex items-center gap-2 active:scale-95"
                >
                  Jelajahi Profil
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-8 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-600">NPSN: 20517647</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-600">Akreditasi A</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-600">Kurikulum Merdeka</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-teal-500 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-600">DevSecOps Shield</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Anti-Gravity Levitating Cards */}
            <div className="lg:col-span-5 relative min-h-[460px] flex items-center justify-center">
              
              {/* Main Center Floating Card */}
              <FloatingCard duration={5.5} glow={true} className="w-full max-w-sm z-20">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3.5 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full border border-teal-100 uppercase tracking-wider">
                    SIAKAD Digital
                  </span>
                  <ShieldCheck className="w-5 h-5 text-teal-500" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Transkrip Nilai Real-time
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Kemudahan bagi Siswa, Wali Murid, dan Tenaga Pendidik memantau evaluasi hasil belajar secara transparan.
                </p>
                <div className="bg-slate-50 rounded-2xl p-3.5 flex items-center justify-between text-xs font-semibold text-slate-700 border border-slate-100">
                  <span className="text-slate-500">Standar Keamanan</span>
                  <span className="text-teal-700 bg-teal-100/60 px-2.5 py-1 rounded-lg font-bold">
                    JWT & Encrypted
                  </span>
                </div>
              </FloatingCard>

              {/* Floating Orbit Top-Right */}
              <FloatingCard
                duration={4.8}
                delay={0.8}
                className="absolute -top-6 -right-2 sm:right-2 z-30 w-52 p-5 bg-white border-teal-100/80"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-[0_6px_16px_rgba(245,158,11,0.25)]">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Prestasi</span>
                    <span className="block text-sm font-bold text-slate-900">Sekolah Unggul</span>
                  </div>
                </div>
              </FloatingCard>

              {/* Floating Orbit Bottom-Left */}
              <FloatingCard
                duration={6}
                delay={1.5}
                className="absolute -bottom-8 -left-2 sm:left-2 z-30 w-56 p-5 bg-white border-teal-100/80"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-teal-500 text-white flex items-center justify-center font-bold shadow-[0_6px_16px_rgba(20,184,166,0.25)]">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Pendidik</span>
                    <span className="block text-sm font-bold text-slate-900">24+ Guru Berdedikasi</span>
                  </div>
                </div>
              </FloatingCard>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS SECTION WITH BREATHING ROOM */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-center">
            <div className="p-4 space-y-1">
              <span className="block text-4xl sm:text-5xl font-extrabold text-teal-600 tracking-tight">450+</span>
              <span className="text-sm font-medium text-slate-500">Siswa Aktif</span>
            </div>
            <div className="p-4 space-y-1">
              <span className="block text-4xl sm:text-5xl font-extrabold text-teal-600 tracking-tight">24</span>
              <span className="text-sm font-medium text-slate-500">Guru & Tenaga Pengajar</span>
            </div>
            <div className="p-4 space-y-1">
              <span className="block text-4xl sm:text-5xl font-extrabold text-amber-500 tracking-tight">12</span>
              <span className="text-sm font-medium text-slate-500">Ruang Kelas Nyaman</span>
            </div>
            <div className="p-4 space-y-1">
              <span className="block text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">A</span>
              <span className="text-sm font-medium text-slate-500">Akreditasi Unggul</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VISI & MISI SECTION WITH SOFT CARDS */}
      <section id="visi-misi" className="py-24 bg-slate-50/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs uppercase tracking-widest font-bold text-teal-700 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-200/50">
              Profil SDN 2 Tegalsari
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Visi & Misi Pendidikan
            </h2>
            <p className="text-slate-500 text-base leading-relaxed">
              Komitmen berkelanjutan kami dalam membimbing generasi penerus bangsa yang bertakwa, berakhlak mulia, dan adaptif terhadap teknologi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Card Visi */}
            <FloatingCard isStatic={true} className="p-10 border-t-4 border-t-teal-500 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6 font-bold">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Visi Sekolah</h3>
                <p className="text-slate-600 leading-relaxed italic text-lg font-medium">
                  "Terwujudnya Peserta Didik yang Bertaqwa, Berkarakter Pancasila, Cerdas, Berprestasi, dan Berwawasan Lingkungan Global."
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-teal-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-500" /> Landasan Utama Kurikulum Merdeka
              </div>
            </FloatingCard>

            {/* Card Misi */}
            <FloatingCard isStatic={true} className="p-10 border-t-4 border-t-emerald-500 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 font-bold">
                  <Building2 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Misi Utama</h3>
                <ul className="space-y-4 text-slate-600 text-sm font-medium">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                    <span>Menyelenggarakan kegiatan belajar berpusat pada siswa dengan fasilitas pembelajaran modern.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                    <span>Menanamkan nilai budi pekerti, kejujuran, dan ketakwaan kepada Tuhan Yang Maha Esa.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                    <span>Menerapkan SIAKAD digital untuk transparansi dan kemudahan layanan akademik.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Berorientasi pada Pengembangan Karakter
              </div>
            </FloatingCard>

          </div>
        </div>
      </section>

      {/* 4. BERITA TERBARU SECTION (REACT QUERY WITH HOVER FLOATING CARDS) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-teal-700 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200/50">
                Informasi & Kabar
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
                Berita Terbaru Sekolah
              </h2>
            </div>
            <Link
              to="/berita"
              className="text-teal-600 hover:text-teal-700 font-bold flex items-center gap-1.5 text-sm transition-all group"
            >
              Lihat Semua Berita <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingPosts ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-slate-100 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-slate-50 rounded-3xl p-16 text-center text-slate-400 text-sm border border-slate-100">
              Belum ada berita yang dipublikasikan saat ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {posts.map((post) => (
                <FloatingCard
                  key={post.id}
                  isStatic={true}
                  className="p-0 overflow-hidden flex flex-col h-full bg-white border border-slate-100"
                >
                  <div className="h-52 bg-slate-100 overflow-hidden relative">
                    <img
                      src={post.image_url || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 px-3.5 py-1 bg-teal-500 text-white text-xs font-bold rounded-full shadow-sm">
                      Kabar Sekolah
                    </span>
                  </div>
                  <div className="p-7 flex flex-col flex-grow justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-teal-500" />
                          {new Date(post.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-teal-500" />
                          {post.author?.name || 'Admin'}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg leading-snug line-clamp-2 hover:text-teal-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">
                        {post.content}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100">
                      <Link
                        to={`/berita/${post.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 hover:text-teal-700"
                      >
                        Baca Selengkapnya <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </FloatingCard>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="py-24 bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-teal-200 border border-white/20 uppercase tracking-wider">
            Sistem Informasi Akademik
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Akses Layanan SIAKAD Digital
          </h2>
          <p className="text-teal-100/90 max-w-2xl mx-auto text-base sm:text-lg font-normal leading-relaxed">
            Masuk dengan akun Siswa, Guru, atau Admin untuk mengakses transkrip nilai dan pengelolaan data sekolah SDN 2 Tegalsari.
          </p>
          <div className="pt-4">
            <Link
              to="/login"
              className="bg-white hover:bg-teal-50 text-teal-900 rounded-full px-9 py-4 font-bold text-base shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              Masuk ke SIAKAD <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
