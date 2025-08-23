import * as services from '@services/Document.services';

import responses from '@utils/responses';
import AppError from '@utils/system/AppError';

/**
 * Extracts and validates query parameter for document operations
 * @param queryParam - Raw query parameter from request
 * @returns string - Validated query parameter
 * @throws AppError if parameter is missing or invalid
 */
export function getQuery(queryParam: unknown): string {
   const query = queryParam as string;
   if (!query) {
      throw new AppError(responses.Document.requiredId, 400);
   }
   return query;
}

/**
 * Validates that a document file does not already exist
 * @param filename - Name of the document file to check
 * @returns Promise<void>
 * @throws AppError if document already exists
 */
export async function comprobeInexistence(filename: string): Promise<void> {
   const exist = await services.exists(filename);
   if (exist) {
      throw new AppError(responses.Document.alreadyExists, 409);
   }
}

/**
 * Validates that a document file exists before operations
 * @param filename - Name of the document file to check
 * @returns Promise<void>
 * @throws AppError if document does not exist
 */
export async function comprobeExistence(filename: string): Promise<void> {
   const exist = await services.exists(filename);
   if (!exist) {
      throw new AppError(responses.Document.notFound, 404);
   }
}
