import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/context/Auth.context';

interface AdminProtectedProps {
  children?: React.ReactNode;
}

const AdminProtected: React.FC<AdminProtectedProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/restricted" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AdminProtected;
