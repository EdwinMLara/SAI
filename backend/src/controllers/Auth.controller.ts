import { Request, Response, NextFunction } from 'express';

import * as auth from '@auth/crypt';
import * as services from '@services/Auth.services';
import * as helpers from '@helpers/User.helpers';
import * as userServices from '@services/User.services';
import * as cookies from '@utils/cookies/manageCookies';

import { UserInt } from '@cmm_interfaces/index';

import responses from '@utils/responses';
import AppError from '@utils/system/AppError';

/**
 * Registers a new user in the system
 * Validates user uniqueness, invite existence, encrypts password and sets authentication cookies
 * @param req - Express request object containing user registration data in body
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns Promise<void>
 */
export async function register(
   req: Request<object, object, UserInt>,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      await helpers.comprobeUnicity(req.body);
      await helpers.comprobeInvite(req.body.email);
      req.body.password = await auth.encrypt(req.body.password);
      req.body.role = await helpers.findRole(req.body.email);
      await userServices.createUser(req.body);
      await cookies.setAuthToken(res, req.body);
      await cookies.setRefreshToken(res, req.body);

      res.status(200).json({
         message: responses.User.created,
         data: {
            user: await helpers.returnUser(req.body),
         },
      });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}

/**
 * Authenticates a user with email and password
 * Sets authentication and refresh tokens as HTTP cookies upon successful login
 * @param req - Express request object containing email and password in body
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns Promise<void>
 */
export async function login(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const { email, password } = req.body;
      if (!email || !password) {
         throw new AppError(responses.System.missingFieldBody, 400);
      }
      const user = await userServices.getUserByObject(
         await userServices.getIdUser(email)
      );
      await services.login(user, password);
      await cookies.setAuthToken(res, user);
      await cookies.setRefreshToken(res, user);

      res.status(200).json({ message: responses.System.ok });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}

/**
 * Refreshes user authentication tokens using a valid refresh token
 * Validates the refresh token and issues new authentication tokens
 * @param req - Express request object containing refresh token in cookies
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns Promise<void>
 */
export async function refreshToken(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const { refreshToken } = req.cookies;
      const { user } = await services.refreshUserTokens(refreshToken, res);
      const returnUser = await helpers.returnUser(user);

      res.status(200).json({
         message: responses.System.ok,
         data: {
            user: returnUser,
            isAuthenticated: true,
         },
      });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}

/**
 * Logs out a user by clearing authentication cookies
 * Removes both access and refresh tokens from client
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns Promise<void>
 */
export async function logout(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      cookies.clearAuthCookies(res);

      res.status(200).json({ message: responses.System.ok });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}

/**
 * Checks the current session state and token validity
 * Returns user authentication status, user data, and token validity information
 * @param req - Express request object containing user and token status information
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns Promise<void>
 */
export async function sessionState(
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> {
   try {
      const tokenStatus = req.tokenStatus || {
         hasValidAccess: false,
         hasValidRefresh: false,
      };

      if (!req.user || !req.user.id) {
         res.status(200).json({
            message: responses.System.ok,
            data: {
               isAuthenticated: false,
               user: null,
               access: tokenStatus.hasValidAccess,
               refresh: tokenStatus.hasValidRefresh,
            },
         });
         return;
      }

      const user = await userServices.getUserById(req.user.id);
      const publicUser = await helpers.returnUser(user);
      res.status(200).json({
         message: responses.System.ok,
         data: {
            isAuthenticated: true,
            user: publicUser,
            access: tokenStatus.hasValidAccess,
            refresh: tokenStatus.hasValidRefresh,
         },
      });
   } catch (error) {
      if (error instanceof AppError) {
         return next(error);
      }
      return next(new AppError(responses.System.serverError, 500, error));
   }
}
