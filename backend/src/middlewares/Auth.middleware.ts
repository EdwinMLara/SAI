import { Request, NextFunction, Response } from 'express';

import * as tokens from '@utils/auth/tokens';
import * as validators from '@middlewares/validators/Auth.validators';

import { UserInfoAtToken } from '../types/index';

import responses from '@responses';
import AppError from '@utils/AppError';

/* ------------------ Code ------------------ */

const Identity = (req: Request, res: Response, next: NextFunction): void => {
  if (req.url.startsWith('/api/auth/')) {
    return next();
  }
  try {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken || !refreshToken) {
      throw new AppError(responses.System.authenticationError, 401);
    }

    validators.verifyToken(accessToken);

    const user = userData(accessToken);

    if (!user || !user.email) {
      throw new AppError(responses.System.authenticationError, 401);
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

const Auth = (...allow: string[]) => {
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

function userData(token: string): UserInfoAtToken {
  try {
    const data = tokens.getPayload(token);
    if (!data) {
      throw new AppError(responses.System.authenticationError, 500);
    }

    return data as UserInfoAtToken;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(responses.System.serverError, 500, error);
  }
}

export default Identity;
export { Auth };
