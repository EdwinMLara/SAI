import AppError from '@utils/system/AppError';
import responses from '@utils/system/responses';

import { PublicUserInt, UserInt } from '@cmm_interfaces/index';
import { comprobeUniqueFields, userByIndexed } from '@services/User.services';

/* ------------------ Code ------------------ */

export async function comprobeFields(
   username?: string,
   email?: string,
   phone?: string
): Promise<string | void> {
   const fields: { username?: string; email?: string; phone?: string } = {};

   if (username !== undefined) fields.username = username;
   if (email !== undefined) fields.email = email;
   if (phone !== undefined) fields.phone = phone;

   const findField = await comprobeUniqueFields(fields);
   if (findField) {
      return `El ${findField} ya está en uso.`;
   }
}

export async function returnPublicUser(
   userIndex: string
): Promise<PublicUserInt> {
   const user = await userByIndexed(userIndex);

   return {
      _id: user._id,
      image: user.image ?? '',
      name: user.name,
      username: user.username,
      phone: user.phone,
      email: user.email,
      role: user.role,
   };
}
