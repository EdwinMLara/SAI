import InvoiceModel from '../models/Invoice.model';
import { InvoiceInterface } from '../interfaces/Invoice.interfaces';

export async function createInvoice(invoiceData: InvoiceInterface): Promise<{
  status: number;
  message: string;
}> {
  const existingInvoice = await InvoiceModel.findOne({
    invoice: invoiceData.invoice,
  });

  if (existingInvoice) {
    return {
      status: 409,
      message: 'Invoice already exists.',
    };
  }

  const newInvoice = new InvoiceModel(invoiceData);
  await newInvoice.save();

  return {
    status: 201,
    message: 'Invoice created successfully.',
  };
}

export async function getInvoice(invoice: string): Promise<{
  status: number;
  message: string;
  data?: InvoiceInterface;
}> {
  const response = await InvoiceModel.findOne({ invoice });

  if (!response) {
    return {
      status: 404,
      message: 'Invoice not found.',
    };
  }
  return {
    status: 200,
    message: 'Invoice retrieved successfully.',
    data: response as InvoiceInterface,
  };
}

export async function updateInvoice(
  body: InvoiceInterface,
  invoice: string
): Promise<{
  status: number;
  message: string;
}> {
  const existingInvoice = await InvoiceModel.findOne({ invoice });

  if (!existingInvoice) {
    return {
      status: 404,
      message: 'Invoice not found.',
    };
  }

  await InvoiceModel.updateOne({ invoice }, { $set: body });
  return {
    status: 200,
    message: 'Invoice updated successfully.',
  };
}

export async function deleteInvoice(invoice: string): Promise<{
  status: number;
  message: string;
}> {
  const existingInvoice = await InvoiceModel.findOne({
    invoice,
  });
  if (!existingInvoice) {
    return {
      status: 404,
      message: 'Invoice not found.',
    };
  }
  await InvoiceModel.deleteOne({
    invoice,
  });
  return {
    status: 200,
    message: 'Invoice deleted successfully.',
  };
}
