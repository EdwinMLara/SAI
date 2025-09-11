import { Request, Response, NextFunction } from 'express';

import getParam from '@utils/system/getParam';
import AppError from '@utils/system/AppError';
import responses from '@utils/system/responses';

import { UserChangesInt } from '@cmm_interfaces/index';
import { comprobeUnicity } from '@helpers/User.helpers';
import { updatedUser, changeRole } from '@services/User.services';

/* ------------------ Code ------------------ */

export async function updateUser(
   req: Request<unknown, unknown, Partial<UserChangesInt>>,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const updates = req.body;
      const repeatFields = await comprobeUnicity(
         updates.username,
         updates.email,
         updates.phone
      );

      if (repeatFields) {
         res.status(404).json({ message: repeatFields });
      }

      const changes = await updatedUser(updates, req.user.id);
      res.json({ message: responses.User.updated, data: { user: changes } });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}

export async function changeUserRole(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const newRole = getParam(req.params.role);
      if (newRole !== 'admin' && newRole !== 'user') {
         return next(new AppError(responses.System.missingFieldBody, 400));
      }

      const user = await changeRole(newRole, req.user.id);

      res.status(200).json({ message: responses.System.ok });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}
