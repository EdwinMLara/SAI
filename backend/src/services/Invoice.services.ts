import InvoiceModel from '@models/Invoice.model';

import { InvoiceInt } from '@cmm_interfaces/index';

import responses from '@utils/responses';
import AppError from '@utils/system/AppError';

/* ------------------ Code ------------------ */

export async function createInvoice(invoiceData: InvoiceInt): Promise<void> {
   const newInvoice = new InvoiceModel(invoiceData);
   await newInvoice.save();
}

export async function getInvoice(invoiceId: string): Promise<InvoiceInt> {
   const invoice = await InvoiceModel.findOne({ invoiceId });

   if (!invoice) {
      throw new AppError(responses.Invoice.notFound, 404);
   }

   return invoice as InvoiceInt;
}

export async function updateInvoice(
   body: InvoiceInt,
   invoiceId: string
): Promise<void> {
   const result = await InvoiceModel.updateOne({ invoiceId }, { $set: body });

   if (result.matchedCount === 0) {
      throw new AppError(responses.Invoice.notFound, 404);
   }
}

export async function deleteInvoice(invoiceId: string): Promise<void> {
   const result = await InvoiceModel.deleteOne({ invoiceId });

   if (result.deletedCount === 0) {
      throw new AppError(responses.Invoice.notFound, 404);
   }
}

export async function existInvoice(invoiceId: string): Promise<boolean> {
   const invoice = await InvoiceModel.findOne({ invoiceId });
   return !!invoice;
}
