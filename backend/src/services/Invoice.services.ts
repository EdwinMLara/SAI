import InvoiceModel from '@models/Invoice.model';
import { InvoiceInterface } from '@interfaces/Invoice.interfaces';

export async function createInvoice(invoiceData: InvoiceInterface): Promise<{
  status: number;
  message: string;
}> {
  const newInvoice = new InvoiceModel(invoiceData);
  await newInvoice.save();

  return {
    status: 201,
    message: 'Invoice created successfully.',
  };
}

export async function getInvoice(id: string): Promise<{
  status: number;
  message: string;
  data?: InvoiceInterface;
}> {
  const response = await InvoiceModel.findOne({ id });
  return {
    status: 200,
    message: 'Invoice retrieved successfully.',
    data: response as InvoiceInterface,
  };
}

export async function updateInvoice(
  body: InvoiceInterface,
  id: string
): Promise<{
  status: number;
  message: string;
}> {
  await InvoiceModel.updateOne({ id }, { $set: body });
  return {
    status: 200,
    message: 'Invoice updated successfully.',
  };
}

export async function deleteInvoice(id: string): Promise<{
  status: number;
  message: string;
}> {
  await InvoiceModel.deleteOne({
    id,
  });
  return {
    status: 200,
    message: 'Invoice deleted successfully.',
  };
}
