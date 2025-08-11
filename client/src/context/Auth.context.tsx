import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from 'react';
import * as services from '@services/Auth.services';
import {
  NewUser,
  PublicUser,
  UserCredentials,
} from '@interfaces/User.interfaces';

/* ------------------ Code ------------------ */

interface AuthContextType {
  user: PublicUser | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  register: (user: NewUser) => Promise<void>;
  login: (
    user: UserCredentials
  ) => Promise<{ message: string; status: number }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await services.session();
      setUser(sessionData.user);
      setIsAuthenticated(sessionData.isAuthenticated);
    };
    fetchSession();
  }, []);

  const login = async (
    user: UserCredentials
  ): Promise<{ message: string; status: number }> => {
    const loginRequest = await services.login(user);
    if (loginRequest.status === 200) {
      const sessionRequest = await services.session();
      setUser(sessionRequest.user || null);
      setIsAuthenticated(sessionRequest.isAuthenticated);
      return { message: 'Redirigiendo...', status: loginRequest.status };
    }
    return { message: loginRequest.message, status: loginRequest.status };
  };

  const register = async (user: NewUser): Promise<void> => {
    const registerRequest = await services.register(user);
    setIsAuthenticated(registerRequest.status === 201);
  };

  const logout = async (): Promise<void> => {
    const response = await services.logout();
    if (response.status === 200) {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
