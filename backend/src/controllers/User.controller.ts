import { Request, Response, NextFunction, response } from 'express';

import getParam from '@utils/system/getParam';
import AppError from '@utils/system/AppError';
import responses from '@utils/system/responses';

import supabase from '@config/supabase';
import { UserChangesInt, ChangeUserRoleInt } from '@cmm_interfaces/index';
import { comprobeUnicity } from '@helpers/User.helpers';
import {
   updatedUser,
   changeRole,
   changeImageProfile,
   userByIndexed,
   returnUser,
   searchUsers,
} from '@services/User.services';
import { compareHash, encrypt } from '@utils/auth/crypt';

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

export async function changePassword(
   req: Request<
      unknown,
      unknown,
      { currentPassword: string; newPassword: string }
   >,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
         return next(new AppError(responses.System.missingFieldBody, 400));
      }

      const user = await returnUser(req.user.id);
      const isValidPassword = await compareHash(currentPassword, user.password);

      if (!isValidPassword) {
         return next(new AppError(responses.User.invalidpassword, 400));
      }

      const hashedPassword = await encrypt(newPassword);
      await updatedUser({ password: hashedPassword }, req.user.id);

      res.json({ message: responses.User.updated });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}

export async function changeUserRole(
   req: Request<unknown, unknown, ChangeUserRoleInt>,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const { userId, newRole } = req.body;

      if (!userId || !newRole) {
         return next(new AppError(responses.System.missingFieldBody, 400));
      }

      if (newRole !== 'admin' && newRole !== 'user') {
         return next(new AppError('Rol inválido', 400));
      }

      if (userId === req.user.id) {
         return next(new AppError('No puedes cambiar tu propio rol', 400));
      }

      await changeRole(newRole, userId);

      res.status(200).json({
         message: `Rol de usuario actualizado a ${newRole}`,
         success: true,
      });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}

export async function changeImage(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      if (!req.file) {
         return next(new AppError(responses.System.missingFieldBody, 400));
      }

      const filename = `${req.user.id}.${req.file.mimetype}`;
      const url = await changeImageProfile(req.file, filename);
      const publicUser = await updatedUser({ image: url }, req.user.id);

      res.status(201).json({
         message: responses.User.updated,
         data: publicUser,
      });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}

export async function getUsers(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const result = await searchUsers(req.query);

      res.status(200).json({ message: responses.System.ok, data: result });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}
