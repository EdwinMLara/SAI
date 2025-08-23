import { Request, NextFunction, Response } from 'express';

import * as helpers from '@helpers/Auth.helpers';

import responses from '@utils/responses';
import AppError from '@utils/system/AppError';

/**
 * Authentication middleware that validates access and refresh tokens
 * Skips authentication for auth-related endpoints
 * Requires valid tokens for protected routes
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
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

/**
 * Session checking middleware that validates tokens without blocking requests
 * Sets token status and user information in request object for downstream use
 * Does not reject requests with invalid tokens, just provides status information
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
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
   } catch {
      req.tokenStatus = {
         hasValidAccess: false,
         hasValidRefresh: false,
      };
      next();
   }
};

export default Identity;
export { SessionChecker };
