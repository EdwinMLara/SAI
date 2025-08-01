import { generateAccessToken, generateRefreshToken } from '@utils/auth/tokens';
import { getIdUser } from '@services/User.services';
import { RefreshTokenInfo, UserInfoAtToken } from '@types';
import { UserInterface } from '@interfaces/User.interfaces';

export async function getRefreshData(user: UserInterface): Promise<string> {
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

export async function getAuthData(user: UserInterface): Promise<string> {
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
