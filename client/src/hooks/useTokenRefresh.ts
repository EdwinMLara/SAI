import { useEffect, useRef } from 'react';
import { useAuth } from '@context/Auth.context';
import * as services from '@services/Auth.services';

export const useTokenRefresh = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const checkAndRefreshToken = async () => {
      try {
        const sessionData = await services.session();

        if (sessionData.refresh && !sessionData.access) {
          await services.refresh();
        } else if (!sessionData.refresh && !sessionData.access) {
          await logout();
        }
      } catch (error) {
        console.warn('Error checking token status:', error);
      }
    };

    intervalRef.current = setInterval(checkAndRefreshToken, 5 * 60 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAuthenticated, user, logout]);

  return {
    isTokenRefreshActive: !!intervalRef.current,
  };
};
