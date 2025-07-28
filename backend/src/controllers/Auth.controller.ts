import { Request, Response, NextFunction } from 'express';

import * as services from '@services/Auth.services';
import * as cookies from '@utils/cookies/manageCookies';
import * as User from '@services/User.services';

import responses from '@responses';
import AppError from '@utils/AppError';

/* ------------------ Code ------------------ */

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError(responses.System.missingFieldBody, 400);
    }
    const user = await User.getUserByObject(await User.getIdUser(email));
    await services.login(user, password);
    await cookies.setAuthToken(res, user);
    await cookies.setRefreshToken(res, user);

    res.status(200).json({ message: responses.System.ok });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await User.getUserById(req.user.id);
    await cookies.setAuthToken(res, user);
    res.status(200).json({ message: responses.System.ok });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
    res.status(200).json({ message: responses.System.ok });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}
