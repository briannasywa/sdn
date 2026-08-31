import { GraduationCap, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-20 pb-10 border-t border-slate-800 relative overflow-hidden font-sans">
      {/* Soft Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12 pb-16 border-b border-slate-800/80">
          
          {/* Brand & Vision */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-teal-500 flex items-center justify-center text-white font-bold shadow-[0_6px_16px_rgba(20,184,166,0.25)]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">SDN 2 Tegalsari</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              Mewujudkan peserta didik yang bertakwa, cerdas, berkarakter Pancasila, dan berwawasan digital di Kepanjen, Kabupaten Malang.
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950/80 border border-teal-800/50 text-teal-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              DevSecOps Protected Platform
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-bold mb-5 text-xs tracking-wider uppercase">Tautan Cepat</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-teal-400 transition-colors">
                  Beranda Utama
                </Link>
              </li>
              <li>
                <a href="/#visi-misi" className="hover:text-teal-400 transition-colors">
                  Profil & Visi Misi
                </a>
              </li>
              <li>
                <Link to="/berita" className="hover:text-teal-400 transition-colors">
                  Berita & Pengumuman
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-teal-400 transition-colors">
                  Portal SIAKAD Siswa & Guru
                </Link>
              </li>
            </ul>
          </div>

          {/* School Information */}
          <div>
            <h4 className="text-white font-bold mb-5 text-xs tracking-wider uppercase">Informasi Sekolah</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>NPSN: <strong className="text-slate-200">20517647</strong></li>
              <li>Akreditasi: <strong className="text-slate-200">A (Unggul)</strong></li>
              <li>Kurikulum: <strong className="text-slate-200">Kurikulum Merdeka</strong></li>
              <li>Jam Belajar: 07.00 - 13.00 WIB</li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div className="space-y-3.5">
            <h4 className="text-white font-bold mb-5 text-xs tracking-wider uppercase">Kontak & Lokasi</h4>
            <div className="flex items-start gap-3 text-sm text-slate-400">
              <MapPin className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
              <span>Jl. Raya Tegalsari No. 2, Kec. Kepanjen, Kab. Malang, Jawa Timur 65163</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Phone className="w-4 h-4 text-teal-500 shrink-0" />
              <span>(0341) 395-882</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Mail className="w-4 h-4 text-teal-500 shrink-0" />
              <span>info@sdn2tegalsari.sch.id</span>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SDN 2 Tegalsari Kepanjen. Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="flex items-center gap-1.5">
            Didesain dengan konsep <span className="text-teal-400 font-bold">Anti-Gravity</span> & DevSecOps.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
