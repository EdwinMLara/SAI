import { ObjectId } from 'mongoose';

import { hasInvite, getInvite } from '@services/Invite.services';
import { findUserByUniqueFields } from '@services/User.services';
import UserModel from '@models/User.model';
import AppError from '@utils/system/AppError';
import responses from '@utils/responses';
import { UserInt, PublicUserInt } from '@cmm_interfaces/index';

/* ------------------ Code ------------------ */

export async function existsUserByEmail(email: string): Promise<boolean> {
   const exist = await UserModel.findOne({ email });
   return !!exist;
}

export async function existsUserById(user: ObjectId): Promise<boolean> {
   const exist = await UserModel.findById(user);
   return !!exist;
}

export async function comprobeInvite(email: string): Promise<void> {
   const exist = await hasInvite(email);
   if (!exist) {
      throw new AppError(responses.Invite.notWasInvite, 401);
   }
}

export async function findRole(
   email: string
): Promise<'super' | 'admin' | 'user'> {
   const invite = await getInvite(email);
   if (!invite) {
      throw new AppError(responses.Invite.notWasInvite, 401);
   }
   return invite.asignedRole;
}

export async function returnUser(user: UserInt): Promise<PublicUserInt> {
   const { image, name, username, phone, email, role } = user;
   return { image: image ?? '', name, username, phone, email, role };
}

export async function comprobeUnicity(user: UserInt): Promise<void> {
   const result = await findUserByUniqueFields({
      email: user.email,
      username: user.username,
      name: user.name,
      phone: user.phone,
   });
   if (result) {
      throw new AppError(`El ${result.field} ya está en uso.`);
   }
}
