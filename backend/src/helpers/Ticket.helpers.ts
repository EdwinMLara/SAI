import * as services from '@services/Ticket.services';

import responses from '@utils/system/responses';
import AppError from '@utils/system/AppError';

/**
 * Extracts and validates query parameter for ticket operations
 * @param queryParam - Raw query parameter from request
 * @returns string - Validated ticket ID parameter
 * @throws AppError if parameter is missing or invalid
 */
export function getQuery(queryParam: unknown): string {
   const query = queryParam as string;
   if (!query) {
      throw new AppError(responses.Ticket.requiredId, 400);
   }
   return query;
}

/**
 * Validates that a ticket file does not already exist
 * @param filename - Name of the ticket file to check
 * @returns Promise<void>
 * @throws AppError if ticket already exists
 */
export async function comprobeInexistence(filename: string): Promise<void> {
   const exist = await services.exists(filename);
   if (exist) {
      throw new AppError(responses.Ticket.alreadyExists, 409);
   }
}

/**
 * Validates that a ticket file exists before operations
 * @param filename - Name of the ticket file to check
 * @returns Promise<void>
 * @throws AppError if ticket does not exist
 */
export async function comprobeExistence(filename: string): Promise<void> {
   const exist = await services.exists(filename);
   if (!exist) {
      throw new AppError(responses.Ticket.notFound, 404);
   }
}
