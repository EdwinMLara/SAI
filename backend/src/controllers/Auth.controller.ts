import { Request, Response, NextFunction } from 'express';

import AppError from '@utils/system/AppError';
import responses from '@utils/system/responses';

import { compareHash } from '@utils/auth/crypt';
import { createUser } from '@services/User.services';
import { userByEmail } from '@services/User.services';
import { comprobeFields, returnPublicUserByUser } from '@helpers/User.helpers';
import { returnPublicUser } from '@helpers/User.helpers';
import * as cookies from '@utils/cookies/manageCookies';
import { NewUserInt, UserCredentialsInt } from '@cmm_interfaces/index';

/* ------------------ Code ------------------ */

export async function login(
   req: Request<unknown, unknown, UserCredentialsInt>,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const { email, password } = req.body;
      const user = await userByEmail(email);

      if (!user) throw new AppError(responses.User.notfound, 403);
      if (!compareHash(password, user.password))
         throw new AppError(responses.User.invalidpassword, 403);

      cookies.setAuthCookie(res, user);

      res.json({
         message: responses.Auth.loginSuccess,
      });
   } catch (error) {
      if (error instanceof AppError) return next(error);
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
      const message = await comprobeFields(username, email, phone);
      if (message) throw new AppError(message, 401);

      const user = await createUser(req.body);
      cookies.setAuthCookie(res, user);

      res.status(201).json({
         message: responses.User.created,
      });
   } catch (error) {
      if (error instanceof AppError) return next(error);
      return next(new AppError(responses.System.serverError, 500, error));
   }
}

export async function sessionRequest(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const publicUser = await returnPublicUser(req.user.id);
      res.json({ data: { publicUser } });
   } catch (error) {
      if (error instanceof AppError) return next(error);
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
      res.json({ message: responses.System.ok });
   } catch (error) {
      if (error instanceof AppError) return next(error);
      return next(new AppError(responses.System.serverError, 500, error));
   }
}
