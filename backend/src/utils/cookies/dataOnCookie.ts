import { ObjectId } from 'mongoose';

import * as tokens from '@auth/tokens';
import AppError from '@utils/system/AppError';

import { UserInfoAtToken } from '@types';
import { UserInt } from '@cmm_interfaces/index';
import { getIdUser } from '@services/User.services';

/* ------------------ Code ------------------ */

export async function onAuthCookie(
   user: UserInt,
   ageToken: number
): Promise<string> {
   try {
      const infoToken = {
         id: await getIdUser(user.email),
         role: user.role,
      };

      return tokens.createToken(infoToken, ageToken);
   } catch (error) {
      throw error;
   }
}
