import { Request, Response, NextFunction } from 'express';
import { UserInterface, UserChanges } from '@interfaces/User.interfaces';

import * as helpers from '@helpers/User.helpers';
import * as services from '@services/User.services';
import * as cookies from '@utils/cookies/manageCookies';

import responses from '@responses';
import * as auth from '@auth/crypt';
import AppError from '@utils/AppError';

/* ------------------ Code ------------------ */

export async function createUser(
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
    await services.createUser(req.body);
    await cookies.setAuthToken(res, req.body);
    await cookies.setRefreshToken(res, req.body);

    res.status(201).json({
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

export async function updateUser(
  req: Request<{}, {}, Partial<UserChanges>>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const updates: Partial<UserChanges> = req.body;
    await helpers.validateUserChanges(updates);
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
