import * as services from '@services/Ticket.services';

import responses from '@utils/system/responses';
import AppError from '@utils/system/AppError';

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
