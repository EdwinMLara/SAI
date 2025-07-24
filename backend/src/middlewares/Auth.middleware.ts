import { Request, NextFunction } from 'express';

import * as services from '@services/Access.services';
import * as validators from '@middlewares/validators/Auth.validators';

import responses from '@responses';
import AppError from '@utils/AppError';

/* ------------------ Code ------------------ */

const Identity = (req: Request, next: NextFunction): void => {
  if (req.url === '/api/login' || req.url === '/api/register') {
    return next();
  }
  try {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken || !refreshToken) {
      throw new AppError('No autorizado', 401);
    }

    validators.verifyToken(accessToken);
    validators.verifyToken(refreshToken);

    const user = services.userData(accessToken);

    if (!user || user.email) {
      throw new AppError('No autorizado', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
};

export default Identity;
