import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import api from '../../api/axios';
import { Calendar, User, ArrowLeft } from 'lucide-react';

export const PostDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/posts/${slug}`);
        if (res.data.success) {
          setPost(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Artikel tidak ditemukan.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [slug]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="pt-32 pb-24 flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/berita"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Berita
          </Link>

          {loading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-10 bg-slate-200 rounded-lg w-3/4" />
              <div className="h-64 bg-slate-200 rounded-2xl" />
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-5/6" />
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl p-12 text-center text-rose-600 font-semibold shadow-sm border border-slate-200">
              {error}
            </div>
          ) : post ? (
            <article className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80 space-y-8">
              <div className="space-y-4">
                <span className="px-3.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase">
                  Berita Sekolah
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                  {post.title}
                </h1>
                <div className="flex items-center gap-6 text-sm text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    {new Date(post.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-600" />
                    Penulis: {post.author?.name || 'Admin'}
                  </span>
                </div>
              </div>

              {post.image_url && (
                <div className="rounded-2xl overflow-hidden shadow-sm max-h-96">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4 whitespace-pre-line text-base">
                {post.content}
              </div>
            </article>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostDetailPage;
