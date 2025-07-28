import { Request, Response, NextFunction } from 'express';

import * as helpers from '@helpers/User.helpers';
import * as services from '@services/User.services';
import * as cookies from '@utils/cookies/manageCookies';

import { UserChanges } from '@interfaces/User.interfaces';

import responses from '@responses';
import AppError from '@utils/AppError';

/* ------------------ Code ------------------ */

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
