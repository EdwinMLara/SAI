import axios from '@config/axios.config';

import {
  UserCredentials,
  PublicUser,
  NewUser,
} from '@interfaces/User.interfaces';

/* ------------------ Code ------------------ */

export async function login(user: UserCredentials): Promise<{
  status: number;
  message: string;
}> {
  const response = await axios.post('/auth/login', user);
  return {
    status: response.status,
    message: response.data.message,
  };
}

export async function register(user: NewUser): Promise<{
  status: number;
  message: string;
  user: PublicUser | null;
}> {
  const response = await axios.post('/auth/register', user);
  return {
    status: response.status,
    message: response.data.message,
    user: response.data.data?.user || null,
  };
}

export async function session(): Promise<{
  user: PublicUser | null;
  isAuthenticated: boolean;
  access: boolean;
  refresh: boolean;
}> {
  try {
    const response = await axios.get('/auth/session');
    const data = response.data.data || response.data;

    return {
      user: data.user || null,
      isAuthenticated: data.isAuthenticated || false,
      access: data.access !== false,
      refresh: data.refresh !== false,
    };
  } catch (error) {
    // Para manejar respuestas de error, extraemos los datos directamente
    const errorResponse = error as any;
    if (errorResponse?.status === 401 && errorResponse?.data) {
      const errorData = errorResponse.data.data || errorResponse.data;
      return {
        user: null,
        isAuthenticated: false,
        access: errorData.access || false,
        refresh: errorData.refresh || false,
      };
    }
    console.warn('Error in session service:', error);
    return {
      user: null,
      isAuthenticated: false,
      access: false,
      refresh: false,
    };
  }
}

export async function logout(): Promise<{
  status: number;
}> {
  const response = await axios.post('/auth/logout');
  return {
    status: response.status,
  };
}

export async function refresh(): Promise<{
  status: number;
  user?: PublicUser | null;
  isAuthenticated?: boolean;
  message?: string;
}> {
  try {
    const response = await axios.get('/auth/refresh');
    return {
      status: response.status,
      user: response.data.data?.user || null,
      isAuthenticated: response.data.data?.isAuthenticated || false,
    };
  } catch (error) {
    // Para manejar respuestas de error con el nuevo formato
    const errorResponse = error as any;
    if (errorResponse?.status && errorResponse?.data) {
      return {
        status: errorResponse.status,
        message: errorResponse.data.message || 'Error al refrescar el token',
        user: null,
        isAuthenticated: false,
      };
    }
    return {
      status: 500,
      message: 'Error de conexión al servidor',
      user: null,
      isAuthenticated: false,
    };
  }
}
