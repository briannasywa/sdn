import { GraduationCap, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 relative overflow-hidden">
      {/* Anti-gravity subtle ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white">SDN 2 Tegalsari</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Mewujudkan generasi cerdas, berkarakter mulia, berwawasan lingkungan, dan menguasai teknologi di Kepanjen, Kabupaten Malang.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/50 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              DevSecOps Protected Platform
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Tautan Cepat</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  Beranda Utama
                </Link>
              </li>
              <li>
                <Link to="/#profil" className="hover:text-emerald-400 transition-colors">
                  Profil & Visi Misi
                </Link>
              </li>
              <li>
                <Link to="/berita" className="hover:text-emerald-400 transition-colors">
                  Berita & Pengumuman
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Portal SIAKAD Siswa & Guru
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Info */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Informasi Sekolah</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>NPSN: 20517647</li>
              <li>Akreditasi: A (Unggul)</li>
              <li>Kurikulum: Kurikulum Merdeka</li>
              <li>Jam Pembelajaran: 07.00 - 13.00 WIB</li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Kontak & Alamat</h4>
            <div className="flex items-start gap-3 text-sm text-slate-400">
              <MapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>Jl. Raya Tegalsari No. 2, Kec. Kepanjen, Kab. Malang, Jawa Timur 65163</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>(0341) 395-882</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>info@sdn2tegalsari.sch.id</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SDN 2 Tegalsari Kepanjen. Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="flex items-center gap-1">
            Dirancang dengan arsitektur <span className="text-emerald-400 font-semibold">Anti-Gravity</span> & DevSecOps.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
