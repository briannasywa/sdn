import { useAuthStore } from '../../store/useAuthStore';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';

export const DashboardRouter = () => {
  const { user } = useAuthStore();

  if (user?.role === 'STUDENT') {
    return <StudentDashboard />;
  }

  // Teacher & Admin
  return <TeacherDashboard />;
};

export default DashboardRouter;
