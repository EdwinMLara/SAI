import * as tokens from '@auth/tokens';

import { UserInfoAtToken } from '@types';

/* ------------------ Code ------------------ */

/**
 * Extracts and validates user information from an authentication cookie token.
 *
 * @param {string} cookie - The authentication token (cookie) to validate and extract user info from.
 * @returns {UserInfoAtToken | null} The user information if the token is valid, otherwise null.
 */
export function useAuthCookie(cookie: string): UserInfoAtToken | null {
   if (!cookie) return null;
   if (!tokens.verifyToken(cookie)) return null;
   return tokens.decodeToken(cookie);
}
