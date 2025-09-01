import apiClient from '../config/axios.config';
import apiPaths from '../config/apiPaths.config';

import { StandardResponse, InvoiceInt } from '@common/interfaces';

/* ------------------ Code ------------------ */

/**
 * Creates a new invoice in the system.
 * @param {InvoiceInt} invoiceData - Invoice data to create.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function createInvoice(
   invoiceData: InvoiceInt
): Promise<StandardResponse> {
   return await apiClient.post(apiPaths.invoices.create, invoiceData);
}

/**
 * Gets a specific invoice by ID.
 * @param {string} id - The invoice ID to retrieve.
 * @returns {Promise<StandardResponse<InvoiceInt>>} Standard backend response with invoice data.
 */
export async function getInvoice(
   id: string
): Promise<StandardResponse<InvoiceInt>> {
   return await apiClient.get(apiPaths.invoices.get(id));
}

/**
 * Updates an existing invoice.
 * @param {string} id - The invoice ID to update.
 * @param {Partial<InvoiceInt>} invoiceData - Partial invoice data to update.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function updateInvoice(
   id: string,
   invoiceData: Partial<InvoiceInt>
): Promise<StandardResponse> {
   return await apiClient.put(apiPaths.invoices.update(id), invoiceData);
}

/**
 * Deletes an invoice from the system.
 * @param {string} id - The invoice ID to delete.
 * @returns {Promise<StandardResponse>} Standard backend response.
 */
export async function deleteInvoice(id: string): Promise<StandardResponse> {
   return await apiClient.delete(apiPaths.invoices.delete(id));
}
