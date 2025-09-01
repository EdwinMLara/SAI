import apiClient from '../config/axios.config';
import apiPaths from '../config/apiPaths.config';

import { StandardResponse } from '@common/interfaces';

/* ------------------ Code ------------------ */

/**
 * Uploads a ticket file for a specific ticket ID.
 * @param {string} ticketId - The ticket ID to associate the file with.
 * @param {FormData} formData - Form data containing the file to upload.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function uploadFile(
   ticketId: string,
   formData: FormData
): Promise<StandardResponse> {
   return await apiClient.post(apiPaths.tickets.upload(ticketId), formData, {
      headers: {
         'Content-Type': 'multipart/form-data',
      },
   });
}

/**
 * Gets the ticket URL for a specific ticket ID.
 * @param {string} ticketId - The ticket ID to get the file for.
 * @returns {Promise<StandardResponse>} Standard backend response with ticket URL.
 */
export async function readTicketURL(
   ticketId: string
): Promise<StandardResponse> {
   return await apiClient.get(apiPaths.tickets.read(ticketId));
}

/**
 * Updates a ticket file for a specific ticket ID.
 * @param {string} ticketId - The ticket ID to update the file for.
 * @param {FormData} formData - Form data containing the new file.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function updateTicket(
   ticketId: string,
   formData: FormData
): Promise<StandardResponse> {
   return await apiClient.put(apiPaths.tickets.update(ticketId), formData, {
      headers: {
         'Content-Type': 'multipart/form-data',
      },
   });
}

/**
 * Deletes a ticket file for a specific ticket ID.
 * @param {string} ticketId - The ticket ID to delete the file for.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function deleteTicket(
   ticketId: string
): Promise<StandardResponse> {
   return await apiClient.delete(apiPaths.tickets.delete(ticketId));
}
