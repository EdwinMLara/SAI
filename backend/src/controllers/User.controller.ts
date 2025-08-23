import { Request, Response, NextFunction } from 'express';

import * as helpers from '@helpers/User.helpers';
import * as services from '@services/User.services';
import * as cookies from '@utils/cookies/manageCookies';

import { UserChangesInt } from '@cmm_interfaces/index';

import responses from '@utils/responses';
import AppError from '@utils/system/AppError';

/* ------------------ Code ------------------ */

export async function updateUser(
   req: Request<object, object, Partial<UserChangesInt>>,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const updates: Partial<UserChangesInt> = req.body;
      const changes = await services.updatedUser(req.user.id, updates);
      await cookies.setAuthToken(res, changes);

      res.status(200).json({
         message: responses.User.updated,
         data: { user: await helpers.returnUser(changes) },
      });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}
