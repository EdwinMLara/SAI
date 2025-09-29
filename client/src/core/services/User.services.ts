import apiClient from '../config/axios.config';
import apiPaths from '../config/apiPaths.config';

import {
   StandardResponse,
   UserChangesInt,
   InviteInt,
   PublicUserInt,
   ChangeUserRoleInt,
} from '@common/interfaces';

/* ------------------ Code ------------------ */

/**
 * Updates the current user's profile information.
 * @param {Partial<UserChangesInt>} userData - User data to update.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function updateUser(
   userData: Partial<UserChangesInt>
): Promise<StandardResponse> {
   return await apiClient.patch(apiPaths.user.update, userData);
}

/**
 * Changes the current user's password.
 * @param {string} currentPassword - Current password for validation.
 * @param {string} newPassword - New password to set.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function changePassword(
   currentPassword: string,
   newPassword: string
): Promise<StandardResponse> {
   return await apiClient.patch(apiPaths.user.changePassword, {
      currentPassword,
      newPassword,
   });
}

/**
 * Changes user role for specified user.
 * @param {ChangeUserRoleInt} data - Object containing userId and newRole.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function changeUserRole(
   data: ChangeUserRoleInt
): Promise<StandardResponse> {
   return await apiClient.post(apiPaths.user.changeRole, data);
}

/* ------------------ Invite Management ------------------ */

/**
 * Creates a new invitation (admin only).
 * @param {InviteInt} inviteData - Invitation data to create.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function createInvite(
   inviteData: InviteInt
): Promise<StandardResponse> {
   return await apiClient.post(apiPaths.user.invites.create, inviteData);
}

/**
 * Gets all invitations in the system (admin only).
 * @returns {Promise<StandardResponse<InviteInt[]>>} Standard backend response with invitations array.
 */
export async function getInvites(): Promise<StandardResponse<InviteInt[]>> {
   return await apiClient.get(apiPaths.user.invites.get);
}

/**
 * Removes an invitation from the system (admin only).
 * @param {string} inviteId - The invitation ID to remove.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function removeInvite(
   inviteId: string
): Promise<StandardResponse> {
   return await apiClient.delete(apiPaths.user.invites.delete, {
      data: { inviteId },
   });
}

/**
 * Updates the current user's profile picture.
 * @param {File} file - Image file to upload.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function updateProfileImage(
   file: File
): Promise<StandardResponse> {
   const formData = new FormData();
   formData.append('file', file);

   return await apiClient.patch(apiPaths.user.changeImage, formData, {
      headers: {
         'Content-Type': 'multipart/form-data',
      },
   });
}

export async function getUsers(query?: Record<string, any>): Promise<
   StandardResponse<{
      data: PublicUserInt[];
      pagination: {
         total: number;
         page: number;
         limit: number;
         totalPages: number;
      };
   }>
> {
   const params = new URLSearchParams(query);
   return await apiClient.get(`${apiPaths.user.get}?${params.toString()}`);
}
