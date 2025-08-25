import apiClient from '../config/axios.config';
import apiPaths from '../config/apiPaths.config';

import {
   UserCredentialsInt,
   NewUserInt,
   StandardResponse,
} from '@common/interfaces';

/* ------------------ Code ------------------ */

/**
 * Logs in with the user's credentials.
 * @param {UserCredentialsInt} credentials - User credentials (email and password).
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function login(
   credentials: UserCredentialsInt
): Promise<StandardResponse> {
   return await apiClient.post(apiPaths.auth.login, credentials);
}

/**
 * Registers a new user in the system.
 * @param {NewUserInt} data - New user data.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function register(data: NewUserInt): Promise<StandardResponse> {
   return await apiClient.post(apiPaths.auth.register, data);
}

/**
 * Logs out the current user.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function logout(): Promise<StandardResponse> {
   return await apiClient.post(apiPaths.auth.logout);
}

/**
 * Refreshes the user's authentication token.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function refresh(): Promise<StandardResponse> {
   return await apiClient.post(apiPaths.auth.refresh);
}

/**
 * Gets the current session of the authenticated user.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function getSession(): Promise<StandardResponse> {
   return await apiClient.get(apiPaths.auth.session);
}
