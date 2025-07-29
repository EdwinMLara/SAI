import InvoiceModel from '@models/Invoice.model';

import { InvoiceInterface } from '@interfaces/Invoice.interfaces';

import responses from '@responses';
import AppError from '@utils/AppError';

/* ------------------ Code ------------------ */

export async function createInvoice(
  invoiceData: InvoiceInterface
): Promise<void> {
  try {
    const newInvoice = new InvoiceModel(invoiceData);
    await newInvoice.save();
  } catch (error) {
    throw error;
  }
}

export async function getInvoice(invoiceId: string): Promise<InvoiceInterface> {
  try {
    const invoice = await InvoiceModel.findOne({ invoiceId });

    if (!invoice) {
      throw new AppError(responses.Invoice.notFound, 404);
    }

    return invoice as InvoiceInterface;
  } catch (error) {
    throw error;
  }
}

export async function updateInvoice(
  body: InvoiceInterface,
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
