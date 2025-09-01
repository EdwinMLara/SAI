import apiClient from '../config/axios.config';
import apiPaths from '../config/apiPaths.config';

import {
   UserCredentialsInt,
   NewUserInt,
   StandardResponse,
   PublicUserInt,
} from '@common/interfaces';

/* ------------------ Code ------------------ */

/**
 * Logs in with the user's credentials.
 * @param {UserCredentialsInt} credentials - User credentials (email and password).
 * @returns {Promise<StandardResponse<PublicUserInt>>} Standard backend response with user data.
 */
export async function login(
   credentials: UserCredentialsInt
): Promise<StandardResponse<PublicUserInt>> {
   return await apiClient.post(apiPaths.auth.login, credentials);
}

/**
 * Registers a new user in the system.
 * @param {NewUserInt} userData - New user data to register.
 * @returns {Promise<StandardResponse<PublicUserInt>>} Standard backend response with created user data.
 */
export async function register(
   userData: NewUserInt
): Promise<StandardResponse<PublicUserInt>> {
   return await apiClient.post(apiPaths.auth.register, userData);
}

/**
 * Logs out the current user.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function logout(): Promise<StandardResponse> {
   return await apiClient.post(apiPaths.auth.logout);
}

/**
 * Gets the current session of the authenticated user.
 * @returns {Promise<StandardResponse<PublicUserInt>>} Standard backend response with session user data.
 */
export async function getSession(): Promise<StandardResponse<PublicUserInt>> {
   return await apiClient.get(apiPaths.auth.session);
}
