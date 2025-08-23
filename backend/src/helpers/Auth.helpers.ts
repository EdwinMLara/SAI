import * as tokens from '@auth/tokens';

import { UserInfoAtToken } from '../types/index';

import responses from '@utils/responses';
import AppError from '@utils/system/AppError';

export function verifyToken(token: string): boolean {
   try {
      if (!token) return false;
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

export function validateTokenPair(
   accessToken: string,
   refreshToken: string
): {
   hasValidAccess: boolean;
   hasValidRefresh: boolean;
} {
   try {
      return {
         hasValidAccess: verifyToken(accessToken),
         hasValidRefresh: verifyToken(refreshToken),
      };
   } catch {
      return {
         hasValidAccess: false,
         hasValidRefresh: false,
      };
   }
}
