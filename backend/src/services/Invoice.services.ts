import { FilterQuery } from 'mongoose';

import InvoiceModel from '@models/Invoice.model';

import { InvoiceInterface,PaginatedInvoicesResponse, MonthTotals  } from '@interfaces/Invoice.interfaces';

import responses from '@responses';
import AppError from '@utils/AppError';

/* ------------------ Helpers ------------------ */

/* Construye el filtro de MongoDB para un mes en formato YYYY-MM */
function buildMonthFilter(month?: string): FilterQuery<InvoiceInterface> {
  if (!month) return {};

  const [yearStr, monthStr] = month.split('-');
  const year = parseInt(yearStr, 10);
  const monthIndex = parseInt(monthStr, 10) - 1;

  if (
    isNaN(year) ||
    isNaN(monthIndex) ||
    monthIndex < 0 ||
    monthIndex > 11
  ) {
    return {};
  }

  return {
    date: {
      $gte: new Date(year, monthIndex, 1),
      $lt: new Date(year, monthIndex + 1, 1),
    },
  };
}

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
    const filter = buildMonthFilter(month);

    // 3. Calculamos cuántos documentos saltarnos
    const skip = (page - 1) * limit;

    // Zona horaria del servidor para agrupar por el mismo mes que el frontend
    const offsetMinutes = -new Date().getTimezoneOffset();
    const tzSign = offsetMinutes >= 0 ? '+' : '-';
    const tzAbs = Math.abs(offsetMinutes);
    const timezone = `${tzSign}${String(Math.floor(tzAbs / 60)).padStart(2, '0')}:${String(tzAbs % 60).padStart(2, '0')}`;

    const [invoices, total, monthTotals] = await Promise.all([
      InvoiceModel.find(filter)
        .sort({ date: -1 }) 
        .skip(skip)         
        .limit(limit),      
      InvoiceModel.countDocuments(filter),
      InvoiceModel.aggregate<MonthTotals>([
        { $match: filter },
        {
          $addFields: {
            _month: {
              $dateToString: { format: '%Y-%m', date: '$date', timezone },
            },
            _iva: {
              $sum: {
                $map: {
                  input: { $ifNull: ['$products', []] },
                  as: 'product',
                  in: { $ifNull: ['$$product.prices.iva', 0] },
                },
              },
            },
          },
        },
        {
          $group: {
            _id: '$_month',
            subtotal: { $sum: { $ifNull: ['$subtotal', 0] } },
            iva: { $sum: '$_iva' },
            total: { $sum: { $ifNull: ['$total', 0] } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: -1 } },
        {
          $project: {
            _id: 0,
            month: '$_id',
            subtotal: 1,
            iva: 1,
            total: 1,
            count: 1,
          },
        },
      ]),
    ]);

    const totalPages = Math.ceil(total / limit);

    return{
      invoices: invoices as InvoiceInterface[],
      total,
      totalPages,
      page,
      limit,
      monthTotals
    };

  } catch (error) {
    throw error;
  }
}

/* Devuelve todas las facturas (sin paginar) para exportar, filtradas por mes */
export async function getInvoicesByMonth(
  month?: string
): Promise<InvoiceInterface[]> {
  try {
    const filter = buildMonthFilter(month);

    const invoices = await InvoiceModel.find(filter).sort({ date: -1 });

    return invoices as InvoiceInterface[];
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
