import * as tokens from '@auth/tokens';

import { UserInfoAtToken } from '../types/index';

import responses from '@utils/responses';
import AppError from '@utils/system/AppError';

/**
 * Verifies the validity of a JWT token
 * @param token - JWT token string to verify
 * @returns boolean - True if token is valid, false otherwise
 * @throws AppError if verification process fails
 */
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

/**
 * Extracts user data from a JWT token payload
 * @param token - JWT token string containing user information
 * @returns UserInfoAtToken - Decoded user information from token
 * @throws AppError if token payload extraction fails
 */
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

/**
 * Validates both access and refresh tokens simultaneously
 * @param accessToken - JWT access token to validate
 * @param refreshToken - JWT refresh token to validate
 * @returns Object containing validity status of both tokens
 */
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
