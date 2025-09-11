import { Response } from 'express';

import env from '@config/env';

import { onAuthCookie } from './dataOnCookie';
import { PublicUserInt, UserInt } from '@cmm_interfaces/index';

/* ------------------ Code ------------------ */

export async function setAuthCookie(
   res: Response,
   user: UserInt | PublicUserInt
): Promise<void> {
   const age = 15 * 24 * 60 * 60 * 1000;
   const token = await onAuthCookie(user, age);

   res.cookie('authCookie', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/',
      maxAge: age,
   });
}

export function clearCookies(res: Response): void {
   res.cookie('authCookie', '', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/',
      expires: new Date(0),
   });
}
