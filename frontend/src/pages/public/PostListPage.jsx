import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import FloatingCard from '../../components/common/FloatingCard';
import api from '../../api/axios';
import { Newspaper, Calendar, User, Search, ChevronRight } from 'lucide-react';

export const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPosts = async (query = '') => {
    setLoading(true);
    try {
      const res = await api.get(`/posts?search=${encodeURIComponent(query)}`);
      if (res.data.success) {
        setPosts(res.data.data.posts);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPosts(search);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="pt-32 pb-24 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <Newspaper className="w-4 h-4" /> Informasi Sekolah
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900">Berita & Artikel SDN 2 Tegalsari</h1>
            <p className="text-slate-600">
              Kumpulan kabar terbaru, prestasi siswa, dan pengumuman kegiatan sekolah di Kepanjen.
            </p>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto relative pt-4">
              <input
                type="text"
                placeholder="Cari berita atau pengumuman..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-24 py-3 bg-white border border-slate-200 rounded-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-7" />
              <button
                type="submit"
                className="absolute right-1.5 top-5.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-full shadow transition-all"
              >
                Cari
              </button>
            </form>
          </div>

          {/* Posts Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-500 max-w-lg mx-auto shadow-sm border border-slate-200">
              Tidak ada artikel yang cocok dengan pencarian Anda.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map((post, idx) => (
                <FloatingCard
                  key={post.id}
                  duration={5}
                  delay={idx * 0.15}
                  className="p-0 overflow-hidden flex flex-col h-full bg-white border-slate-200/80"
                >
                  <div className="h-48 bg-slate-100 overflow-hidden relative">
                    <img
                      src={post.image_url || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80'}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
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
                    <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-grow">
                      {post.content}
                    </p>
                    <Link
                      to={`/berita/${post.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-800"
                    >
                      Baca Selengkapnya <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </FloatingCard>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostListPage;
