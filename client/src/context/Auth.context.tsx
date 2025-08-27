import React, {
   createContext,
   ReactNode,
   useContext,
   useState,
   useEffect,
   useCallback,
} from 'react';
import {
   PublicUserInt,
   NewUserInt,
   UserCredentialsInt,
   StandardResponse,
} from '@common/interfaces';
import * as AuthServices from '../core/services/Auth.services';

/* ------------------ Code ------------------ */

interface AuthContextType {
   isAuthenticated: boolean;
   user: PublicUserInt | null;
   login: (credentials: UserCredentialsInt) => Promise<StandardResponse>;
   register: (data: NewUserInt) => Promise<StandardResponse>;
   logout: () => Promise<StandardResponse>;
   refresh: () => Promise<StandardResponse>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
   undefined
);

interface AuthProviderProps {
   children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
   const [user, setUser] = useState<PublicUserInt | null>(null);
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [loading, setLoading] = useState(true);

   // Cargar sesión al montar
   useEffect(() => {
      const fetchSession = async () => {
         setLoading(true);
         const res = await AuthServices.getSession();
         if (res.success && res.data?.user) {
            setUser(res.data.user);
            setIsAuthenticated(res.data.isAuthenticated ?? true);
         } else {
            setUser(null);
            setIsAuthenticated(false);
         }
         setLoading(false);
      };
      fetchSession();
   }, []);

   // Login
   const login = useCallback(async (credentials: UserCredentialsInt) => {
      setLoading(true);
      const res = await AuthServices.login(credentials);
      if (res.success && res.data?.user) {
         setUser(res.data.user);
         setIsAuthenticated(true);
      } else {
         setUser(null);
         setIsAuthenticated(false);
      }
      setLoading(false);
      return res;
   }, []);

   // Registro
   const register = useCallback(async (data: NewUserInt) => {
      setLoading(true);
      const res = await AuthServices.register(data);
      if (res.success && res.data?.user) {
         setUser(res.data.user);
         setIsAuthenticated(true);
      } else {
         setUser(null);
         setIsAuthenticated(false);
      }
      setLoading(false);
      return res;
   }, []);

   // Logout
   const logout = useCallback(async () => {
      setLoading(true);
      const res = await AuthServices.logout();
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return res;
   }, []);

   // Refrescar tokens
   const refresh = useCallback(async () => {
      setLoading(true);
      const res = await AuthServices.refresh();
      if (res.success && res.data?.user) {
         setUser(res.data.user);
         setIsAuthenticated(true);
      } else {
         setUser(null);
         setIsAuthenticated(false);
      }
      setLoading(false);
      return res;
   }, []);

   const value: AuthContextType = {
      user,
      isAuthenticated,
      login,
      register,
      logout,
      refresh,
   };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
   return context;
};
