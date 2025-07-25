import { getIdUser } from '@services/User.services';
import { RefreshTokenInfo, UserInfoAtToken } from '@types';
import { UserInterface } from '@interfaces/User.interfaces';

/* ------------------ Code ------------------ */

export async function getRefreshData(
  user: UserInterface
): Promise<RefreshTokenInfo> {
  try {
    const userId = await getIdUser(user.email);
    const refreshTokenInfo: RefreshTokenInfo = {
      id: userId.toString(),
    };
    return refreshTokenInfo;
  } catch (error) {
    throw error;
  }
}

export async function getAuthData(
  user: UserInterface
): Promise<UserInfoAtToken> {
  try {
    const userId = await getIdUser(user.email);
    const UserInfoAtToken: UserInfoAtToken = {
      id: userId.toString(),
      name: user.name,
      role: user.role,
      email: user.email,
    };
    return UserInfoAtToken;
  } catch (error) {
    throw error;
  }
}
