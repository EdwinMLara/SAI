import InvoiceModel from '@models/Invoice.model';
import { InvoiceInterface } from '@interfaces/Invoice.interfaces';
import responses from '@utils/responses';
import logger from '@utils/logger';

export async function createInvoice(invoiceData: InvoiceInterface): Promise<{
  status: number;
  message: string;
}> {
  try {
    const newInvoice = new InvoiceModel(invoiceData);
    await newInvoice.save();

    return {
      status: 201,
      message: responses.INVOICE_CREATED,
    };
  } catch (error) {
    throw error;
  }
}

export async function getInvoice(id: string): Promise<{
  status: number;
  message: string;
  data?: InvoiceInterface;
}> {
  try {
    const response = await InvoiceModel.findOne({ id });

    if (!response) {
      return {
        status: 404,
        message: responses.INVOICE_NOT_FOUND,
      };
    }

    return {
      status: 200,
      message: responses.INVOICE_FOUND,
      data: response as InvoiceInterface,
    };
  } catch (error) {
    throw error;
  }
}

export async function updateInvoice(
  body: InvoiceInterface,
  id: string
): Promise<{
  status: number;
  message: string;
}> {
  try {
    const result = await InvoiceModel.updateOne({ id }, { $set: body });

    if (result.matchedCount === 0) {
      return {
        status: 404,
        message: responses.INVOICE_NOT_FOUND,
      };
    }

    return {
      status: 200,
      message: responses.INVOICE_UPDATED,
    };
  } catch (error) {
    throw error;
  }
}

export async function deleteInvoice(id: string): Promise<{
  status: number;
  message: string;
}> {
  try {
    const result = await InvoiceModel.deleteOne({ id });

    if (result.deletedCount === 0) {
      return {
        status: 404,
        message: responses.INVOICE_NOT_FOUND,
      };
    }

    return {
      status: 200,
      message: responses.INVOICE_DELETED,
    };
  } catch (error) {
    throw error;
  }
}
