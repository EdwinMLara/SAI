import { Response } from 'express';

import { getRefreshData, getAuthData } from './filterData';
import { UserInt } from '@cmm_interfaces/index';

/* ------------------ Code ------------------ */

export async function setRefreshToken(
  res: Response,
  user: UserInt
): Promise<void> {
  const token = await getRefreshData(user);

  try {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    throw error;
  }
}

export async function setAuthToken(
  res: Response,
  user: UserInt
): Promise<void> {
  const token = await getAuthData(user);

  try {
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 1000,
    });
  } catch (error) {
    throw error;
  }
}

export function clearAuthCookies(res: Response): void {
  const base = {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    expires: new Date(0),
    maxAge: 0,
  };
  res.cookie('accessToken', '', base);
  res.cookie('refreshToken', '', base);
}
