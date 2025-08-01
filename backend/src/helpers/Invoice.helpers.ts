import * as services from '@services/Invoice.services';

import responses from '@responses';
import AppError from '@utils/AppError';

export async function comprobeInexistence(invoiceId: string): Promise<void> {
  try {
    const exist = await services.existInvoice(invoiceId);
    if (exist) {
      throw new AppError(responses.Invoice.alreadyExists, 409);
    }
  } catch (error) {
    throw error;
  }
}

export async function comprobeExistence(invoiceId: string): Promise<void> {
  try {
    const exist = await services.existInvoice(invoiceId);
    if (!exist) {
      throw new AppError(responses.Invoice.notFound, 404);
    }
  } catch (error) {
    throw error;
  }
}

export function getQuery(queryParam: any): string {
  try {
    const query = queryParam as string;
    if (!query) {
      throw new AppError(responses.Invoice.requiredId, 400);
    }
    return query;
  } catch (error) {
    throw error;
  }
}
