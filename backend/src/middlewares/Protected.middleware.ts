import { Request, NextFunction, Response } from 'express';

import * as helpers from '@helpers/Auth.helpers';

import responses from '@responses';
import AppError from '@utils/system/AppError';

/* ------------------ Code ------------------ */

const Protect = (...allow: string[]) => {
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

export default Protect;
