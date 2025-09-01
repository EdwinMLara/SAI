import apiClient from '../config/axios.config';
import apiPaths from '../config/apiPaths.config';

import { StandardResponse } from '@common/interfaces';

/* ------------------ Code ------------------ */

/**
 * Uploads a document file for a specific invoice.
 * @param {string} invoiceId - The invoice ID to associate the document with.
 * @param {FormData} formData - Form data containing the file to upload.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function uploadFile(
   invoiceId: string,
   formData: FormData
): Promise<StandardResponse> {
   return await apiClient.post(apiPaths.documents.upload(invoiceId), formData, {
      headers: {
         'Content-Type': 'multipart/form-data',
      },
   });
}

/**
 * Gets the document URL for a specific invoice.
 * @param {string} invoiceId - The invoice ID to get the document for.
 * @returns {Promise<StandardResponse>} Standard backend response with document URL.
 */
export async function readDocumentURL(
   invoiceId: string
): Promise<StandardResponse> {
   return await apiClient.get(apiPaths.documents.read(invoiceId));
}

/**
 * Updates a document file for a specific invoice.
 * @param {string} invoiceId - The invoice ID to update the document for.
 * @param {FormData} formData - Form data containing the new file.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function updateDocument(
   invoiceId: string,
   formData: FormData
): Promise<StandardResponse> {
   return await apiClient.put(apiPaths.documents.update(invoiceId), formData, {
      headers: {
         'Content-Type': 'multipart/form-data',
      },
   });
}

/**
 * Deletes a document for a specific invoice.
 * @param {string} invoiceId - The invoice ID to delete the document for.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function deleteDocument(
   invoiceId: string
): Promise<StandardResponse> {
   return await apiClient.delete(apiPaths.documents.delete(invoiceId));
}
