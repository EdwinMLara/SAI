import AppError from '@utils/system/AppError';
import responses from '@utils/system/responses';

import { checkFields } from '@services/User.services';

/* ------------------ Code ------------------ */

export async function comprobeUnicity(
   username?: string,
   email?: string,
   phone?: string
): Promise<string | void> {
   const fields: { username?: string; email?: string; phone?: string } = {};

   if (username !== undefined) fields.username = username;
   if (email !== undefined) fields.email = email;
   if (phone !== undefined) fields.phone = phone;

   const findField = await checkFields(fields);
   if (findField) {
      return `El ${findField} ya está en uso.`;
   }
}
