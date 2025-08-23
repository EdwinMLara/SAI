import { compareHash } from '../utils/auth/crypt';
import { UserInt } from '@cmm_interfaces/index';
import * as authHelpers from '@helpers/Auth.helpers';
import * as userServices from '@services/User.services';
import * as cookies from '@utils/cookies/manageCookies';
import { Response } from 'express';

import responses from '@utils/responses';
import AppError from '@utils/system/AppError';

export async function login(user: UserInt, password: string): Promise<void> {
   const isValidPassword = await compareHash(password, user.password);
   if (!isValidPassword) {
      throw new AppError(responses.User.invalidpassword, 401);
   }
}

export async function refreshUserTokens(
   refreshToken: string,
   res: Response
): Promise<{ user: UserInt; publicUser: unknown }> {
   if (!refreshToken) {
      throw new AppError(responses.System.authenticationError, 401);
   }

   if (!authHelpers.verifyToken(refreshToken)) {
      throw new AppError(responses.System.authenticationError, 401);
   }

   const userData = authHelpers.userData(refreshToken);
   if (!userData || !userData.id) {
      throw new AppError(responses.System.authenticationError, 401);
   }

   const user = await userServices.getUserById(userData.id);
   await cookies.setAuthToken(res, user);
   await cookies.setRefreshToken(res, user);

   return { user, publicUser: userData };
}
