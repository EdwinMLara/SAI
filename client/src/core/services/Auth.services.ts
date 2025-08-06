import axios from '../config/axios.config';

import {
  UserCredentials,
  PublicUser,
  NewUser,
} from '../interfaces/User.interfaces';

/* ------------------ Code ------------------ */

export async function login(user: UserCredentials): Promise<{
  status: number;
  message: string;
  isAuthenticated: boolean;
}> {
  try {
    const response = await axios.post('/auth/login', user);
    return {
      status: response.status,
      message: response.data.message,
      isAuthenticated: response.data.isAuthenticated,
    };
  } catch (error) {
    return {
      status: 500,
      message: 'Hubo un error con la solicitud. Intenta nuevamente.',
      isAuthenticated: false,
    };
  }
}

export async function register(user: NewUser): Promise<{
  status: number;
  message: string;
}> {
  try {
    const response = await axios.post('/auth/register', user);
    return {
      status: response.status,
      message: response.data.message,
    };
  } catch (error) {
    return {
      status: 500,
      message: 'Hubo un error con la solicitud. Intenta nuevamente.',
    };
  }
}

export async function session(): Promise<{
  status: number;
  user: PublicUser;
  isAuthenticated: boolean;
}> {
  try {
    const response = await axios.get('/auth/session');
    console.log(response);
    return {
      status: response.status,
      user: response.data.user,
      isAuthenticated: response.data.isAuthenticated,
    };
  } catch (error) {
    console.error('Session error:', error);
    return {
      status: 200,
      user: null as any,
      isAuthenticated: false,
    };
  }
}
