import * as tokens from '@auth/tokens';
import AppError from '@utils/system/AppError';

import { UserInfoAtToken } from '@types';
import { PublicUserInt, UserInt } from '@cmm_interfaces/index';

/* ------------------ Code ------------------ */

export async function onAuthCookie(
   user: PublicUserInt | UserInt,
   ageToken: number
): Promise<string> {
   try {
      const infoToken: UserInfoAtToken = {
         id: user._id,
         role: user.role,
      };

      return tokens.createToken(infoToken, ageToken);
   } catch (error) {
      throw error;
   }
}
