import { Response } from 'express';

import { getRefreshData, getAuthData } from './filterData';
import { UserInterface } from '@interfaces/User.interfaces';

/* ------------------ Code ------------------ */

export async function setRefreshToken(
  res: Response,
  user: UserInterface
): Promise<void> {
  const data = await getRefreshData(user);

  try {
    res.cookie('refreshToken', data, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh',
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    throw error;
  }
}

export async function setAuthToken(
  res: Response,
  user: UserInterface
): Promise<void> {
  const data = await getAuthData(user);

  try {
    res.cookie('accessToken', data, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    throw error;
  }
}
