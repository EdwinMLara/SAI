import { compareHash } from '../utils/auth/crypt';
import { UserInterface } from '@interfaces/User.interfaces';

import responses from '@responses';
import AppError from '@utils/AppError';

/* ------------------ Code ------------------ */

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
