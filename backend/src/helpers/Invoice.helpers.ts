import * as services from '@services/Invoice.services';

import responses from '@utils/responses';
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

/**
 * Extracts and validates query parameter for invoice operations
 * @param queryParam - Raw query parameter from request
 * @returns string - Validated invoice ID
 * @throws AppError if parameter is missing or invalid
 */
export function getQuery(queryParam: unknown): string {
   const query = queryParam as string;
   if (!query) {
      throw new AppError(responses.Invoice.requiredId, 400);
   }
   return query;
}
