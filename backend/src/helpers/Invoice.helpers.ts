import * as services from '@services/Invoice.services';

import responses from '@utils/system/responses';
import AppError from '@utils/system/AppError';

/**
 * Validates that an invoice does not already exist
 * @param invoiceId - Invoice ID to check for existence
 * @returns Promise<void>
 * @throws AppError if invoice already exists
 */
export async function comprobeInexistence(invoiceId: string): Promise<void> {
   const exist = await services.existInvoice(invoiceId);
   if (exist) {
      throw new AppError(responses.Invoice.alreadyExists, 409);
   }
}

/**
 * Validates that an invoice exists before operations
 * @param invoiceId - Invoice ID to check for existence
 * @returns Promise<void>
 * @throws AppError if invoice does not exist
 */
export async function comprobeExistence(invoiceId: string): Promise<void> {
   const exist = await services.existInvoice(invoiceId);
   if (!exist) {
      throw new AppError(responses.Invoice.notFound, 404);
   }
}
