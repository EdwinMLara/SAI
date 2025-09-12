import { Request, Response, NextFunction } from 'express';

import * as cookies from '@utils/cookies/manageCookies';

import AppError from '@utils/system/AppError';
import responses from '@utils/system/responses';

import { compareHash } from '@utils/auth/crypt';
import { hasInvite, removeInvite } from '@services/Invite.services';
import { comprobeUnicity } from '@helpers/User.helpers';
import { NewUserInt, UserCredentialsInt } from '@cmm_interfaces/index';
import { createUser, userByIndexed, returnUser } from '@services/User.services';

/* ------------------ Code ------------------ */

export async function login(
   req: Request<unknown, unknown, UserCredentialsInt>,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const { email, password } = req.body;
      const user = await returnUser(email);

      const isValidPassword = await compareHash(password, user.password);
      if (!isValidPassword) {
         throw new AppError(responses.User.invalidpassword, 404);
      }

      await cookies.setAuthCookie(res, user);

      res.status(200).json({
         message: responses.Auth.loginSuccess,
      });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}

export async function register(
   req: Request<unknown, unknown, NewUserInt>,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const { email, password, username, phone } = req.body;
      const message = await comprobeUnicity(username, email, phone);

      if (message) {
         throw new AppError(message, 401);
      }

      const isInvited = await hasInvite(email);
      if (!isInvited) {
         throw new AppError(responses.User.inviteNotFound, 404);
      }

      await createUser(req.body);
      await removeInvite(email);

      const user = await userByIndexed(email);
      await cookies.setAuthCookie(res, user);

      res.status(201).json({
         message: responses.User.created,
      });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}

export async function sessionRequest(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const publicUser = await userByIndexed(req.user.id);
      res.status(200).json({
         message: responses.System.ok,
         data: { publicUser },
      });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}

export async function logout(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      cookies.clearCookies(res);
      res.status(200).json({ message: responses.System.ok });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}
