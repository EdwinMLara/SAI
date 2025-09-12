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
   isLoading: boolean;
   user: PublicUserInt | null;
   login: (credentials: UserCredentialsInt) => Promise<StandardResponse>;
   register: (data: NewUserInt) => Promise<StandardResponse>;
   logout: () => Promise<StandardResponse>;
   updateUser: (data: Partial<PublicUserInt>) => void;
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
         if (res.success && res.data) {
            setUser(res.data.publicUser);
            setIsAuthenticated(true);
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
      if (res.success && res.data) {
         setUser(res.data);
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
      if (res.success && res.data) {
         setUser(res.data);
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

   const updateUser = (data: Partial<PublicUserInt>) => {
      setUser((prev) => (prev ? { ...prev, ...data } : prev));
   };

   const value: AuthContextType = {
      user,
      isAuthenticated,
      isLoading: loading,
      login,
      register,
      logout,
      updateUser,
   };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
   return context;
};
