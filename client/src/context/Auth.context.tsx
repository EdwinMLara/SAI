import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from 'react';
import { useNavigate } from 'react-router-dom';
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
  register: (user: NewUser) => Promise<{ message: string; status: number }>;
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
  const [sessionChecked, setSessionChecked] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionChecked) return;

    const fetchSession = async () => {
      try {
        const sessionData = await services.session();
        setSessionChecked(true);

        if (sessionData.refresh && !sessionData.access) {
          try {
            const refreshResponse = await services.refresh();
            if (refreshResponse.status === 200) {
              setUser(refreshResponse.user || null);
              setIsAuthenticated(refreshResponse.isAuthenticated || false);
            } else {
              setUser(null);
              setIsAuthenticated(false);
            }
          } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setUser(sessionData.user);
          setIsAuthenticated(sessionData.isAuthenticated);
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
        setSessionChecked(true);
      }
    };
    fetchSession();
  }, [sessionChecked]);

  const login = async (
    user: UserCredentials
  ): Promise<{ message: string; status: number }> => {
    const loginRequest = await services.login(user);
    if (loginRequest.status === 200) {
      const sessionRequest = await services.session();
      setUser(sessionRequest.user || null);
      setIsAuthenticated(sessionRequest.isAuthenticated);
      setSessionChecked(true);
      return { message: 'Redirigiendo...', status: loginRequest.status };
    }
    return { message: loginRequest.message, status: loginRequest.status };
  };

  const register = async (
    user: NewUser
  ): Promise<{ message: string; status: number }> => {
    const registerRequest = await services.register(user);
    if (registerRequest.status !== 200) {
      return {
        status: registerRequest.status,
        message: registerRequest.message,
      };
    }
    setIsAuthenticated(true);
    setUser(registerRequest.user);
    setSessionChecked(true);
    return { message: registerRequest.message, status: registerRequest.status };
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
