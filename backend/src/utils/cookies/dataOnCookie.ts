import { ObjectId } from 'mongoose';
import * as tokens from '@auth/tokens';

import { UserInfoAtToken } from '@types';
import { UserInt } from '@cmm_interfaces/index';
import { getIdUser, getUserById } from '@services/User.services';

import AppError from '@utils/system/AppError';

/* ------------------ Code ------------------ */

export async function onAuthCookie(user: UserInt): Promise<string> {
   try {
      const infoToken = {
         id: await getIdUser(user.email),
         role: user.role,
      };

      return tokens.authToken(infoToken);
   } catch (error) {
      throw error;
   }
}
