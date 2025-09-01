import AppError from '@utils/system/AppError';
import responses from '@utils/system/responses';

import {
   comprobeUniqueFields,
   getUserById,
   userByEmail,
} from '@services/User.services';
import { PublicUserInt, UserInt } from '@cmm_interfaces/index';
import { User } from '@supabase/supabase-js';

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

export function returnPublicUserByUser(user: UserInt): PublicUserInt {
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
