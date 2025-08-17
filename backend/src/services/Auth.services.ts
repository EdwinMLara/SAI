import { compareHash } from '../utils/auth/crypt';
import { UserInterface } from '@interfaces/User.interfaces';
import * as authHelpers from '@helpers/Auth.helpers';
import * as userServices from '@services/User.services';
import * as cookies from '@utils/cookies/manageCookies';
import { Response } from 'express';

import responses from '@responses';
import AppError from '@utils/AppError';

export async function login(
  user: UserInterface,
  password: string
): Promise<void> {
  try {
    const isValidPassword = await compareHash(password, user.password);
    if (!isValidPassword) {
      throw new AppError(responses.User.invalidpassword, 401);
    }
  } catch (error) {
    throw error;
  }
}

export async function refreshUserTokens(
  refreshToken: string,
  res: Response
): Promise<{ user: UserInterface; publicUser: any }> {
  try {
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
  } catch (error) {
    throw error;
  }
}
