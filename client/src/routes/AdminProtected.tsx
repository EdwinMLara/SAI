import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/context/Auth.context';
import { Loading } from '@ui/index.ui';

interface AdminProtectedProps {
   children?: React.ReactNode;
}

const AdminProtected: React.FC<AdminProtectedProps> = ({ children }) => {
   const { user, isAuthenticated, isLoading } = useAuth();
   const location = useLocation();

   if (isLoading) {
      return <Loading message="Verificando permisos de administrador..." />;
   }

   if (!isAuthenticated) {
      return <Navigate to="/auth" state={{ from: location }} replace />;
   }

   if (user?.role !== 'admin') {
      return <Navigate to="/restricted" replace />;
   }

   return children ? <>{children}</> : <Outlet />;
};

export default AdminProtected;
