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
      message: responses.CREATED,
    };
  } catch (error) {
    logger.error('Error creating invoice:', error);
    return {
      status: 500,
      message: responses.INTERNAL_SERVER_ERROR,
    };
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
        message: responses.NOT_FOUND,
      };
    }

    return {
      status: 200,
      message: responses.RETRIEVED,
      data: response as InvoiceInterface,
    };
  } catch (error) {
    logger.error('Error getting invoice:', error);
    return {
      status: 500,
      message: responses.INTERNAL_SERVER_ERROR,
    };
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
        message: responses.NOT_FOUND,
      };
    }

    return {
      status: 200,
      message: responses.UPDATED,
    };
  } catch (error) {
    logger.error('Error updating invoice:', error);
    return {
      status: 500,
      message: responses.INTERNAL_SERVER_ERROR,
    };
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
        message: responses.NOT_FOUND,
      };
    }

    return {
      status: 200,
      message: responses.DELETED,
    };
  } catch (error) {
    logger.error('Error deleting invoice:', error);
    return {
      status: 500,
      message: responses.INTERNAL_SERVER_ERROR,
    };
  }
}
