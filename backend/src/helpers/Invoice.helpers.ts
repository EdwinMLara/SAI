import * as services from '@services/Invoice.services';

import responses from '@utils/responses';
import AppError from '@utils/system/AppError';

export async function comprobeInexistence(invoiceId: string): Promise<void> {
   const exist = await services.existInvoice(invoiceId);
   if (exist) {
      throw new AppError(responses.Invoice.alreadyExists, 409);
   }
}

export async function comprobeExistence(invoiceId: string): Promise<void> {
   const exist = await services.existInvoice(invoiceId);
   if (!exist) {
      throw new AppError(responses.Invoice.notFound, 404);
   }
}

export function getQuery(queryParam: unknown): string {
   const query = queryParam as string;
   if (!query) {
      throw new AppError(responses.Invoice.requiredId, 400);
   }
   return query;
}
