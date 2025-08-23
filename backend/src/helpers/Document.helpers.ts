import * as services from '@services/Document.services';

import responses from '@utils/responses';
import AppError from '@utils/system/AppError';

/* ------------------ Code ------------------ */

export function getQuery(queryParam: unknown): string {
   const query = queryParam as string;
   if (!query) {
      throw new AppError(responses.Document.requiredId, 400);
   }
   return query;
}

export async function comprobeInexistence(filename: string): Promise<void> {
   const exist = await services.exists(filename);
   if (exist) {
      throw new AppError(responses.Document.alreadyExists, 409);
   }
}

export async function comprobeExistence(filename: string): Promise<void> {
   const exist = await services.exists(filename);
   if (!exist) {
      throw new AppError(responses.Document.notFound, 404);
   }
}
