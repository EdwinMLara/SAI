import { Request, NextFunction, Response } from 'express';

import * as helpers from '@helpers/Auth.helpers';

import responses from '@responses';
import AppError from '@utils/system/AppError';

const Identity = (req: Request, res: Response, next: NextFunction): void => {
  if (req.url.startsWith('/api/auth/')) {
    return next();
  }

  try {
    const { accessToken, refreshToken } = req.cookies;
    const tokenValidation = helpers.validateTokenPair(
      accessToken,
      refreshToken
    );

    if (tokenValidation.hasValidRefresh) {
      if (tokenValidation.hasValidAccess) {
        const user = helpers.userData(accessToken);
        if (!user || !user.email) {
          throw new AppError(responses.System.authenticationError, 401);
        }
        req.user = user;
        next();
      } else {
        res.status(401).json({
          message: responses.System.authenticationError,
          data: {
            access: false,
            refresh: true,
          },
        });
        return;
      }
    } else {
      res.status(401).json({
        message: responses.System.authenticationError,
        data: {
          access: false,
          refresh: false,
        },
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

const SessionChecker = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { accessToken, refreshToken } = req.cookies;
    const tokenValidation = helpers.validateTokenPair(
      accessToken,
      refreshToken
    );

    req.tokenStatus = {
      hasValidAccess: tokenValidation.hasValidAccess,
      hasValidRefresh: tokenValidation.hasValidRefresh,
    };

    if (tokenValidation.hasValidAccess) {
      const user = helpers.userData(accessToken);
      if (user && user.email) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    req.tokenStatus = {
      hasValidAccess: false,
      hasValidRefresh: false,
    };
    next();
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
export { Authorize, SessionChecker };
