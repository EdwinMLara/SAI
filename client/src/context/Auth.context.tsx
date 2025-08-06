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

interface AuthContextType {
  user: PublicUser | null;
  isAuthenticated: boolean;
  login: (user: UserCredentials) => Promise<void>;
  register: (user: NewUser) => Promise<void>;
  logout: () => Promise<void>;
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

  const login = async (user: UserCredentials): Promise<void> => {
    const loginRequest = await services.login(user);
    setIsAuthenticated(loginRequest.isAuthenticated);
  };

  const register = async (user: NewUser): Promise<void> => {
    const registerRequest = await services.register(user);
    setIsAuthenticated(registerRequest.status === 201);
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    setIsAuthenticated(false);
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
