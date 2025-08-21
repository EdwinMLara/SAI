import * as services from '@services/Document.services';

import responses from '@responses';
import AppError from '@utils/system/AppError';

/* ------------------ Code ------------------ */

export function getQuery(queryParam: any): string {
  try {
    const query = queryParam as string;
    if (!query) {
      throw new AppError(responses.Document.requiredId, 400);
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
      throw new AppError(responses.Document.alreadyExists, 409);
    }
  } catch (error) {
    throw error;
  }
}

export async function comprobeExistence(filename: string): Promise<void> {
  try {
    const exist = await services.exists(filename);
    if (!exist) {
      throw new AppError(responses.Document.notFound, 404);
    }
  } catch (error) {
    throw error;
  }
}
