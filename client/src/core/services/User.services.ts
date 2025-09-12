import apiClient from '../config/axios.config';
import apiPaths from '../config/apiPaths.config';

import {
   StandardResponse,
   UserChangesInt,
   InviteInt,
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
 * Changes the current user's role.
 * @param {string} role - The new role to assign to the user.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function changeUserRole(role: string): Promise<StandardResponse> {
   return await apiClient.post(apiPaths.user.changeRole(role));
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
   formData.append('image', file);

   return await apiClient.patch(apiPaths.user.changeImage, formData, {
      headers: {
         'Content-Type': 'multipart/form-data',
      },
   });
}
