import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/context/Auth.context';
import { Loading } from '@ui/index.ui';

/* ------------------ Code ------------------ */

interface ProtectedProps {
  children?: React.ReactNode;
}

const Protected: React.FC<ProtectedProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Mostrar un loader mientras se verifica la autenticación
  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    // Guardar la ubicación actual para redirigir después del login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children ? <>{children}</> : <Outlet />;
};

export default Protected;
