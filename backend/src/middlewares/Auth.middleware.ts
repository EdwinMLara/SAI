import { Request, NextFunction, Response } from 'express';

import * as helpers from '@helpers/Auth.helpers';

import responses from '@responses';
import AppError from '@utils/AppError';

/* ------------------ Code ------------------ */

const Identity = (req: Request, res: Response, next: NextFunction): void => {
  if (req.url.startsWith('/api/auth/')) {
    return next();
  }
  try {
    const { accessToken, refreshToken } = req.cookies;

    if (helpers.verifyToken(refreshToken)) {
      if (helpers.verifyToken(accessToken)) {
        const user = helpers.userData(accessToken);
        if (!user || !user.email) {
          throw new AppError(responses.System.authenticationError, 401);
        }
        req.user = user;
        next();
      } else {
        res.status(401).json({
          message: responses.System.authenticationError,
          access: false,
          refresh: true,
        });
        return;
      }
    } else {
      res.status(401).json({
        message: responses.System.authenticationError,
        access: false,
        refresh: false,
      });
      return;
    }
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(responses.System.serverError, 500, error));
  }
};

const Authorize = (...allow: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const userRole = req.user.role.toLowerCase();
      const hasPermission = allow.some(
        (role) => role.toLowerCase() === userRole
      );

      if (!hasPermission) {
        throw new AppError(responses.System.authenticationError, 403);
      }

      next();
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
    }
  };
};

export default Identity;
export { Authorize };
