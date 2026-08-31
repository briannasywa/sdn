import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/public/LandingPage';
import PostListPage from './pages/public/PostListPage';
import PostDetailPage from './pages/public/PostDetailPage';
import LoginPage from './pages/public/LoginPage';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import GradesPage from './pages/dashboard/GradesPage';
import AdminPostCMS from './pages/dashboard/AdminPostCMS';
import TeacherDashboard from './pages/dashboard/TeacherDashboard';

export function App() {
  return (
    <Routes>
      {/* Public Company Profile Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/berita" element={<PostListPage />} />
      <Route path="/berita/:slug" element={<PostDetailPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* SIAKAD Protected Dashboard Routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<GradesPage />} />
        <Route path="grades" element={<GradesPage />} />
        <Route path="posts" element={<AdminPostCMS />} />
        <Route path="students" element={<TeacherDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
