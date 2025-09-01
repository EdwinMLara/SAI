import * as services from '@services/Product.services';

import responses from '@utils/system/responses';
import AppError from '@utils/system/AppError';

/**
 * Validates that a product does not already exist
 * @param keyProduct - Product key to check for existence
 * @returns Promise<void>
 * @throws AppError if product already exists
 */
export async function comprobeInexistence(keyProduct: string): Promise<void> {
   const exist = await services.existProduct(keyProduct);
   if (exist) {
      throw new AppError(responses.Product.alreadyExists, 409);
   }
}

/**
 * Validates that a product exists before operations
 * @param keyProduct - Product key to check for existence
 * @returns Promise<void>
 * @throws AppError if product does not exist
 */
export async function comprobeExistence(keyProduct: string): Promise<void> {
   const exist = await services.existProduct(keyProduct);
   if (!exist) {
      throw new AppError(responses.Product.notFound, 404);
   }
}
