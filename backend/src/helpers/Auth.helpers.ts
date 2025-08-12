import * as tokens from '@auth/tokens';

import { UserInfoAtToken } from '../types/index';

import responses from '@responses';
import AppError from '@utils/AppError';

/* ------------------ Code ------------------ */

export function verifyToken(token: string): boolean {
  try {
    return tokens.verifyToken(token);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(responses.System.serverError, 500, error);
  }
}

export function userData(token: string): UserInfoAtToken {
  try {
    const data = tokens.getPayload(token);
    if (!data) {
      throw new AppError(responses.System.authenticationError, 500);
    }

    return data as UserInfoAtToken;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(responses.System.serverError, 500, error);
  }
}
