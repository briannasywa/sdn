import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { FileText, Plus, Edit, Trash2, X, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export const AdminPostCMS = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    published: true,
  });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts?all=true');
      if (res.data.success) setPosts(res.data.data.posts);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingPostId(null);
    setFormData({ title: '', content: '', image_url: '', published: true });
    setModalOpen(true);
  };

  const handleOpenEditModal = (post) => {
    setEditingPostId(post.id);
    setFormData({
      title: post.title,
      content: post.content,
      image_url: post.image_url || '',
      published: post.published,
    });
    setModalOpen(true);
  };

  const handleSavePost = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (editingPostId) {
        const res = await api.put(`/posts/${editingPostId}`, formData);
        if (res.data.success) setSuccessMsg('Berita/Artikel berhasil diperbarui.');
      } else {
        const res = await api.post('/posts', formData);
        if (res.data.success) setSuccessMsg('Berita/Artikel baru berhasil dibuat.');
      }
      setModalOpen(false);
      fetchPosts();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Gagal menyimpan artikel.');
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return;
    try {
      const res = await api.delete(`/posts/${id}`);
      if (res.data.success) {
        setSuccessMsg('Artikel berhasil dihapus.');
        fetchPosts();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus artikel.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" /> CMS Kelola Berita & Pengumuman Sekolah
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Publikasikan kabar terbaru untuk halaman depan Company Profile
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Tulis Berita Baru
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-600 font-bold">✕</button>
        </div>
      )}

      {/* Posts Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Daftar Artikel (Total: {posts.length})</h3>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm animate-pulse">Memuat daftar artikel...</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">Belum ada artikel dipublikasikan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Judul Artikel</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Penulis</th>
                  <th className="py-3.5 px-6">Tanggal Dibuat</th>
                  <th className="py-3.5 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {posts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 max-w-xs truncate">{p.title}</td>
                    <td className="py-4 px-6">
                      {p.published ? (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1 w-max">
                          <Eye className="w-3.5 h-3.5" /> Dipublikasi
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full flex items-center gap-1 w-max">
                          <EyeOff className="w-3.5 h-3.5" /> Draf
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">{p.author?.name || 'Admin'}</td>
                    <td className="py-4 px-6">
                      {new Date(p.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Edit Artikel"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(p.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Artikel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT POST MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingPostId ? 'Edit Artikel' : 'Tulis Artikel Baru'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSavePost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Judul Artikel</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Judul pengumuman / berita..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">URL Gambar Cover (Opsional)</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Konten / Isi Artikel</label>
                <textarea
                  rows="6"
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Tuliskan berita lengkap di sini..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="publishedCheck"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="publishedCheck" className="text-xs font-semibold text-slate-700">
                  Publikasikan langsung ke Halaman Depan
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
                >
                  {editingPostId ? 'Perbarui Artikel' : 'Simpan & Publikasikan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPostCMS;
