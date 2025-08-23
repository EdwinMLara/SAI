import * as services from '@services/Product.services';

import responses from '@utils/responses';
import AppError from '@utils/system/AppError';

/* ------------------ Code ------------------ */

export async function comprobeInexistence(keyProduct: string): Promise<void> {
   const exist = await services.existProduct(keyProduct);
   if (exist) {
      throw new AppError(responses.Product.alreadyExists, 409);
   }
}

export async function comprobeExistence(keyProduct: string): Promise<void> {
   const exist = await services.existProduct(keyProduct);
   if (!exist) {
      throw new AppError(responses.Product.notFound, 404);
   }
}

export function getQuery(queryParam: unknown): string {
   const query = queryParam as string;
   if (!query) {
      throw new AppError(responses.Product.requiredKey, 400);
   }
   return query;
}
