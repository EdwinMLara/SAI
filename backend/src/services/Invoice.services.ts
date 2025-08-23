import InvoiceModel from '@models/Invoice.model';

import { InvoiceInt } from '@cmm_interfaces/index';

import responses from '@utils/responses';
import AppError from '@utils/system/AppError';

/**
 * Creates a new invoice in the database
 * @param invoiceData - Invoice data object conforming to InvoiceInt interface
 * @returns Promise<void>
 */
export async function createInvoice(invoiceData: InvoiceInt): Promise<void> {
   const newInvoice = new InvoiceModel(invoiceData);
   await newInvoice.save();
}

/**
 * Retrieves a specific invoice by its ID from the database
 * @param invoiceId - Unique identifier for the invoice
 * @returns Promise<InvoiceInt> - The invoice data
 * @throws AppError if invoice is not found
 */
export async function getInvoice(invoiceId: string): Promise<InvoiceInt> {
   const invoice = await InvoiceModel.findOne({ invoiceId });

   if (!invoice) {
      throw new AppError(responses.Invoice.notFound, 404);
   }

   return invoice as InvoiceInt;
}

/**
 * Updates an existing invoice with new data
 * @param body - Updated invoice data
 * @param invoiceId - Unique identifier for the invoice to update
 * @returns Promise<void>
 * @throws AppError if invoice is not found
 */
export async function updateInvoice(
   body: InvoiceInt,
   invoiceId: string
): Promise<void> {
   const result = await InvoiceModel.updateOne({ invoiceId }, { $set: body });

   if (result.matchedCount === 0) {
      throw new AppError(responses.Invoice.notFound, 404);
   }
}

/**
 * Deletes an invoice from the database
 * @param invoiceId - Unique identifier for the invoice to delete
 * @returns Promise<void>
 * @throws AppError if invoice is not found
 */
export async function deleteInvoice(invoiceId: string): Promise<void> {
   const result = await InvoiceModel.deleteOne({ invoiceId });

   if (result.deletedCount === 0) {
      throw new AppError(responses.Invoice.notFound, 404);
   }
}

/**
 * Checks if an invoice exists in the database
 * @param invoiceId - Unique identifier for the invoice to check
 * @returns Promise<boolean> - True if invoice exists, false otherwise
 */
export async function existInvoice(invoiceId: string): Promise<boolean> {
   const invoice = await InvoiceModel.findOne({ invoiceId });
   return !!invoice;
}
