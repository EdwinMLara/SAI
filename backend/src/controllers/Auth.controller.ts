import { Request, Response, NextFunction } from 'express';

import * as auth from '@auth/crypt';
import * as services from '@services/Auth.services';
import * as helpers from '@helpers/User.helpers';
import * as userServices from '@services/User.services';
import * as cookies from '@utils/cookies/manageCookies';

import { UserInterface } from '@interfaces/User.interfaces';

import responses from '@responses';
import AppError from '@utils/AppError';

/* ------------------ Code ------------------ */

export async function register(
  req: Request<{}, {}, UserInterface>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await helpers.existsUserByEmail(req.body.email);

    if (user) {
      throw new AppError(responses.User.alreadyexists, 409);
    }
    await helpers.comprobeInvite(req.body.email);
    req.body.password = await auth.encrypt(req.body.password);
    req.body.role = await helpers.findRole(req.body.email);
    await userServices.createUser(req.body);
    await cookies.setAuthToken(res, req.body);
    await cookies.setRefreshToken(res, req.body);

    res.status(200).json({
      message: responses.User.created,
      user: await helpers.returnUser(req.body),
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}

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
    const user = await userServices.getUserByObject(
      await userServices.getIdUser(email)
    );
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
    const user = await userServices.getUserById(req.user.id);
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

export async function sessionState(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user || !req.user.id) {
      res.status(200).json({
        message: responses.System.ok,
        isAuthenticated: false,
        user: null,
      });
      return;
    }

    const user = await userServices.getUserById(req.user.id);
    const publicUser = await helpers.returnUser(user);
    res.status(200).json({
      message: responses.System.ok,
      isAuthenticated: true,
      user: publicUser,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}
