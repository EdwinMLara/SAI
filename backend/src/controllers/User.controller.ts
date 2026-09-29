import { Request, Response, NextFunction } from 'express';

import * as helpers from '@helpers/User.helpers';
import * as services from '@services/User.services';
import * as cookies from '@utils/cookies/manageCookies';

import { UserChanges } from '@interfaces/User.interfaces';

import responses from '@responses';
import AppError from '@utils/AppError';

import * as auth from '@auth/crypt';
import * as AuthService from '@services/Auth.services';

/* ------------------ Code ------------------ */

export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const users = await services.getAllUsers();
    res.status(200).json({
      message: responses.System.ok,
      users: users,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}

export async function updateUser(
  req: Request<{}, {}, Partial<UserChanges>>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const updates: Partial<UserChanges> = req.body;
    const changes = await services.updatedUser(req.user.id, updates);
    await cookies.setAuthToken(res, changes);

    res.status(200).json({
      message: responses.User.updated,
      user: await helpers.returnUser(changes),
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}

export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new AppError(responses.System.missingFieldBody, 400);
    }
    const user = await services.getUserById(req.user.id);
    await AuthService.login(user, currentPassword);
    const changes = await services.updatedUser(req.user.id, {
      password: await auth.encrypt(newPassword),
    });
    await cookies.setAuthToken(res, changes);
    res.status(200).json({
      message: responses.User.passwordChanged,
      user: await helpers.returnUser(changes),
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
}


