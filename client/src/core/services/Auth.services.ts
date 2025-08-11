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
    user: response.data.all?.user || null,
  };
}

export async function session(): Promise<{
  user: PublicUser | null;
  isAuthenticated: boolean;
}> {
  const response = await axios.get('/auth/session');
  return {
    user: response.data.all?.user || null,
    isAuthenticated: response.data.all?.isAuthenticated || false,
  };
}

export async function logout(): Promise<{
  status: number;
}> {
  const response = await axios.post('/auth/logout');
  return {
    status: response.status,
  };
}
