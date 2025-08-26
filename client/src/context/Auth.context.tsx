import React, {
   createContext,
   useContext,
   useReducer,
   useEffect,
   ReactNode,
} from 'react';
import * as AuthServices from '@/core/services/Auth.services';
import {
   PublicUserInt,
   UserCredentialsInt,
   NewUserInt,
} from '@common/interfaces';

interface AuthState {
   user: PublicUserInt | null;
   isAuthenticated: boolean;
   isLoading: boolean;
   error: string | null;
}

interface AuthContextType extends AuthState {
   login: (credentials: UserCredentialsInt) => Promise<void>;
   register: (userData: NewUserInt) => Promise<void>;
   logout: () => Promise<void>;
   checkSession: () => Promise<void>;
   clearError: () => void;
}

type AuthAction =
   | { type: 'SET_LOADING'; payload: boolean }
   | { type: 'SET_USER'; payload: PublicUserInt | null }
   | { type: 'SET_AUTHENTICATED'; payload: boolean }
   | { type: 'SET_ERROR'; payload: string | null }
   | { type: 'CLEAR_ERROR' }
   | { type: 'LOGOUT' };

const initialState: AuthState = {
   user: null,
   isAuthenticated: false,
   isLoading: true,
   error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function authReducer(state: AuthState, action: AuthAction): AuthState {
   switch (action.type) {
      case 'SET_LOADING':
         return { ...state, isLoading: action.payload };
      case 'SET_USER':
         return { ...state, user: action.payload };
      case 'SET_AUTHENTICATED':
         return { ...state, isAuthenticated: action.payload };
      case 'SET_ERROR':
         return { ...state, error: action.payload, isLoading: false };
      case 'CLEAR_ERROR':
         return { ...state, error: null };
      case 'LOGOUT':
         return { ...initialState, isLoading: false };
      default:
         return state;
   }
}

interface AuthProviderProps {
   children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
   const [state, dispatch] = useReducer(authReducer, initialState);

   const checkSession = async () => {
      try {
         dispatch({ type: 'SET_LOADING', payload: true });
         const response = await AuthServices.getSession();

         if (response.data && response.data.isAuthenticated) {
            dispatch({ type: 'SET_USER', payload: response.data.user });
            dispatch({ type: 'SET_AUTHENTICATED', payload: true });
         } else {
            if (!response.data.access && response.data.refresh) {
               await refreshToken();
            } else {
               dispatch({ type: 'SET_AUTHENTICATED', payload: false });
               dispatch({ type: 'SET_USER', payload: null });
            }
         }
      } catch (error) {
         dispatch({
            type: 'SET_ERROR',
            payload: 'Error al verificar la sesión',
         });
         dispatch({ type: 'SET_AUTHENTICATED', payload: false });
         dispatch({ type: 'SET_USER', payload: null });
      } finally {
         dispatch({ type: 'SET_LOADING', payload: false });
      }
   };

   const refreshToken = async () => {
      try {
         const response = await AuthServices.refresh();

         if (response.data && response.data.isAuthenticated) {
            dispatch({ type: 'SET_USER', payload: response.data.user });
            dispatch({ type: 'SET_AUTHENTICATED', payload: true });
         } else {
            dispatch({ type: 'LOGOUT' });
         }
      } catch (error) {
         dispatch({ type: 'LOGOUT' });
         throw error;
      }
   };

   const login = async (credentials: UserCredentialsInt) => {
      try {
         dispatch({ type: 'SET_LOADING', payload: true });
         dispatch({ type: 'CLEAR_ERROR' });

         await AuthServices.login(credentials);
         await checkSession();
      } catch (error: any) {
         const errorMessage =
            error?.response?.data?.message || 'Error al iniciar sesión';
         dispatch({ type: 'SET_ERROR', payload: errorMessage });
         throw error;
      } finally {
         dispatch({ type: 'SET_LOADING', payload: false });
      }
   };

   const register = async (userData: NewUserInt) => {
      try {
         dispatch({ type: 'SET_LOADING', payload: true });
         dispatch({ type: 'CLEAR_ERROR' });

         const response = await AuthServices.register(userData);

         if (response.data && response.data.user) {
            dispatch({ type: 'SET_USER', payload: response.data.user });
            dispatch({ type: 'SET_AUTHENTICATED', payload: true });
         }
      } catch (error: any) {
         const errorMessage =
            error?.response?.data?.message || 'Error al registrar usuario';
         dispatch({ type: 'SET_ERROR', payload: errorMessage });
         throw error;
      } finally {
         dispatch({ type: 'SET_LOADING', payload: false });
      }
   };

   const logout = async () => {
      try {
         dispatch({ type: 'SET_LOADING', payload: true });
         await AuthServices.logout();
      } catch (error) {
         console.error('Error during logout:', error);
      } finally {
         dispatch({ type: 'LOGOUT' });
      }
   };

   const clearError = () => {
      dispatch({ type: 'CLEAR_ERROR' });
   };

   useEffect(() => {
      checkSession();
   }, []);

   const contextValue: AuthContextType = {
      ...state,
      login,
      register,
      logout,
      checkSession,
      clearError,
   };

   return (
      <AuthContext.Provider value={contextValue}>
         {children}
      </AuthContext.Provider>
   );
}

export function useAuth() {
   const context = useContext(AuthContext);
   if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
}
