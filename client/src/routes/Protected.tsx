import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/context/Auth.context';

/* ------------------ Code ------------------ */

interface ProtectedProps {
  children?: React.ReactNode;
}

const Protected: React.FC<ProtectedProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return children ? <>{children}</> : <Outlet />;
};

export default Protected;
