import InvoiceModel from '@models/Invoice.model';

import { InvoiceInterface,PaginatedInvoicesResponse  } from '@interfaces/Invoice.interfaces';

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

export async function getAllInvoices(
  page: number = 1,
  limit: number = 5,
  month?: string
): Promise<PaginatedInvoicesResponse> {
  try {

/*Aqui armaremos las condiciones de busqueda para MongoDB */
    const filter: any = {};

    if (month) {
      const [yearStr, monthStr] = month.split('-');

      const year = parseInt(yearStr, 10);
      const monthIndex = parseInt(monthStr, 10) - 1;

      const startDate = new Date(year, monthIndex, 1);
      const endDate = new Date(year, monthIndex + 1, 1);

      filter.date = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    // 3. Calculamos cuántos documentos saltarnos
    const skip = (page - 1) * limit;

    const [invoices, total] = await Promise.all([
      InvoiceModel.find(filter)
        .sort({ date: -1 }) 
        .skip(skip)         
        .limit(limit),      
      InvoiceModel.countDocuments(filter), 
    ]);

    const totalPages = Math.ceil(total / limit);

    return{
      invoices: invoices as InvoiceInterface[],
      total,
      totalPages,
      page,
      limit
    };

  } catch (error) {
    throw error;
  }
}

export async function updateInvoice(
  body: InvoiceInterface,
  invoiceId: string
): Promise<void> {
  try {
    const cleanBody = { ...body } as any;
    delete cleanBody._id;
    delete cleanBody.__v;
    const result = await InvoiceModel.updateOne(
      { invoiceId },
      { $set: cleanBody }
    );

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
