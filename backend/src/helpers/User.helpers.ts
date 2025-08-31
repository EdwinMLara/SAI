import AppError from '@utils/system/AppError';
import responses from '@utils/system/responses';

import { comprobeUniqueFields, getUserById } from '@services/User.services';
import { PublicUserInt } from '@cmm_interfaces/index';

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

   const message = `El ${findField} ya está en uso.`;
}

export async function returnPublicUser(userId: string): Promise<PublicUserInt> {
   const user = await getUserById(userId);
   const publicUser: PublicUserInt = {
      image: user.image ?? '',
      name: user.name,
      username: user.username,
      phone: user.phone,
      email: user.email,
      role: user.role,
   };

   return publicUser;
}
