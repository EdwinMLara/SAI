import { Request, Response, NextFunction } from 'express';

import getParam from '@utils/system/getParam';
import AppError from '@utils/system/AppError';
import responses from '@utils/system/responses';

import { updatedUser } from '@services/User.services';
import { changeRole } from '@services/User.services';
import { useAuthCookie } from '@helpers/Auth.helpers';
import { UserChangesInt } from '@cmm_interfaces/index';
import { comprobeFields } from '@helpers/User.helpers';
import { comprobeUniqueFields } from '@services/User.services';

/* ------------------ Code ------------------ */

export async function updateUser(
   req: Request<object, object, Partial<UserChangesInt>>,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const updates: Partial<UserChangesInt> = req.body;

      const repeatFields = await comprobeFields(
         updates.username,
         updates.email,
         updates.phone
      );
      if (repeatFields) res.status(404).json({ message: repeatFields });
      const changes = await updatedUser(req.user.id, updates);

      res.json({ message: responses.User.updated });
   } catch (error) {
      if (error instanceof AppError) return next(error);
      return next(new AppError(responses.System.serverError, 500, error));
   }
}

export async function changeUserRole(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      type typeRole = 'admin' | 'user';
      const paramRole = getParam(req.params.role);
      if (paramRole !== 'admin' && paramRole !== 'user') {
         return next(new AppError(responses.System.missingFieldBody, 400));
      }
      const role: typeRole = paramRole;
      await changeRole(role, req.user.id);

      res.json({ message: responses.System.ok });
   } catch (error) {
      if (error instanceof AppError) return next(error);
      return next(new AppError(responses.System.serverError, 500, error));
   }
}
