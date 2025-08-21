import InvoiceModel from '@models/Invoice.model';

import { InvoiceInt } from '@cmm_interfaces/index.interfaces';

import responses from '@responses';
import AppError from '@utils/AppError';

/* ------------------ Code ------------------ */

export async function createInvoice(invoiceData: InvoiceInt): Promise<void> {
  try {
    const newInvoice = new InvoiceModel(invoiceData);
    await newInvoice.save();
  } catch (error) {
    throw error;
  }
}

export async function getInvoice(invoiceId: string): Promise<InvoiceInt> {
  try {
    const invoice = await InvoiceModel.findOne({ invoiceId });

    if (!invoice) {
      throw new AppError(responses.Invoice.notFound, 404);
    }

    return invoice as InvoiceInt;
  } catch (error) {
    throw error;
  }
}

export async function updateInvoice(
  body: InvoiceInt,
  invoiceId: string
): Promise<void> {
  try {
    const result = await InvoiceModel.updateOne({ invoiceId }, { $set: body });

    if (result.matchedCount === 0) {
      throw new AppError(responses.Invoice.notFound, 404);
    }
  } catch (error) {
    throw error;
  }
}

export async function deleteInvoice(invoiceId: string): Promise<void> {
  try {
    const result = await InvoiceModel.deleteOne({ invoiceId });

    if (result.deletedCount === 0) {
      throw new AppError(responses.Invoice.notFound, 404);
    }
  } catch (error) {
    throw error;
  }
}

export async function existInvoice(invoiceId: string): Promise<boolean> {
  try {
    const invoice = await InvoiceModel.findOne({ invoiceId });
    return !!invoice;
  } catch (error) {
    throw error;
  }
}
