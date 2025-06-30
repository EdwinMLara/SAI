import InvoiceModel from '@models/Invoice.model';
import { InvoiceInterface } from '@interfaces/Invoice.interfaces';
import responses from '@utils/responses';

export async function createInvoice(invoiceData: InvoiceInterface): Promise<{
  status: number;
  message: string;
}> {
  const newInvoice = new InvoiceModel(invoiceData);
  await newInvoice.save();

  return {
    status: 201,
    message: responses.CREATED,
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
    message: responses.RETRIEVED,
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
    message: responses.UPDATED,
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
    message: responses.DELETED,
  };
}
