import { Request, NextFunction, Response, RequestHandler } from 'express';

import * as helpers from '@helpers/Auth.helpers';

import AppError from '@utils/system/AppError';
import responses from '@utils/system/responses';

/* ------------------ Code ------------------ */

type accessType = 'admin' | 'user';

/**
 * Express middleware to authenticate and authorize users based on their role.
 *
 * @param {accessType} access - The required access level ('admin' or 'user').
 * @returns {RequestHandler} An Express request handler that validates the user's authentication cookie and role.
 *
 * @throws {AppError} If authentication fails or the user does not have the required role.
 */
function Auth(access: accessType): RequestHandler {
   return async (
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> => {
      try {
         const { authCookie } = req.cookies;
         const dataOnCookie = helpers.useAuthCookie(authCookie);
         if (!dataOnCookie) throw new AppError(responses.Auth.authError, 401);

         req.user = {
            id: dataOnCookie.id,
            role: dataOnCookie.role,
         };
         const userRole = req.user.role;

         if (access === 'admin' && userRole !== 'admin')
            throw new AppError(responses.Auth.unauthorized, 403);

         if (access === 'user' && userRole !== 'admin' && userRole !== 'user')
            throw new AppError(responses.Auth.unauthorized, 403);

         next();
      } catch (error) {
         next(error);
      }
   };
}

export default Auth;
