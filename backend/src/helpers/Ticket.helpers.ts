import * as services from '@services/Ticket.services';

import responses from '@responses';
import AppError from '@utils/system/AppError';

/* ------------------ Code ------------------ */

export function getQuery(queryParam: any): string {
  try {
    const query = queryParam as string;
    if (!query) {
      throw new AppError(responses.Ticket.requiredId, 400);
    }
    return query;
  } catch (error) {
    throw error;
  }
}

export async function comprobeInexistence(filename: string): Promise<void> {
  try {
    const exist = await services.exists(filename);
    if (exist) {
      throw new AppError(responses.Ticket.alreadyExists, 409);
    }
  } catch (error) {
    throw error;
  }
}

export async function comprobeExistence(filename: string): Promise<void> {
  try {
    const exist = await services.exists(filename);
    if (!exist) {
      throw new AppError(responses.Ticket.notFound, 404);
    }
  } catch (error) {
    throw error;
  }
}
