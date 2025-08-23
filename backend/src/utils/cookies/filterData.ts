import { generateAccessToken, generateRefreshToken } from '@utils/auth/tokens';
import { getIdUser } from '@services/User.services';
import { RefreshTokenInfo, UserInfoAtToken } from '@types';
import { UserInt } from '@cmm_interfaces/index';

/* ------------------ Code ------------------ */

export async function getRefreshData(user: UserInt): Promise<string> {
   try {
      const userId = await getIdUser(user.email);
      const refreshTokenInfo: RefreshTokenInfo = {
         id: userId.toString(),
      };
      return generateRefreshToken(refreshTokenInfo);
   } catch (error) {
      throw error;
   }
}

export async function getAuthData(user: UserInt): Promise<string> {
   try {
      const userId = await getIdUser(user.email);
      const userInfoAtToken: UserInfoAtToken = {
         id: userId.toString(),
         name: user.name,
         role: user.role,
         email: user.email,
      };
      return generateAccessToken(userInfoAtToken);
   } catch (error) {
      throw error;
   }
}
