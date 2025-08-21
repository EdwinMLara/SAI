import * as services from '@services/Product.services';

import responses from '@responses';
import AppError from '@utils/system/AppError';

/* ------------------ Code ------------------ */

export async function comprobeInexistence(keyProduct: string): Promise<void> {
  try {
    const exist = await services.existProduct(keyProduct);
    if (exist) {
      throw new AppError(responses.Product.alreadyExists, 409);
    }
  } catch (error) {
    throw error;
  }
}

export async function comprobeExistence(keyProduct: string): Promise<void> {
  try {
    const exist = await services.existProduct(keyProduct);
    if (!exist) {
      throw new AppError(responses.Product.notFound, 404);
    }
  } catch (error) {
    throw error;
  }
}

export function getQuery(queryParam: any): string {
  try {
    const query = queryParam as string;
    if (!query) {
      throw new AppError(responses.Product.requiredKey, 400);
    }
    return query;
  } catch (error) {
    throw error;
  }
}
