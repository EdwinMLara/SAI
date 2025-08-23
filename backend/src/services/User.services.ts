import { ObjectId } from 'mongoose';

import UserModel from '@models/User.model';
import { UserChangesInt, UserInt } from '@cmm_interfaces/index';

import responses from '@utils/responses';
import AppError from '@utils/system/AppError';

/* ------------------ Code ------------------ */

export async function createUser(user: UserInt): Promise<void> {
   const newUser = new UserModel(user);
   await newUser.save();
}

export async function updatedUser(
   user: string,
   updates: Partial<UserChangesInt>
): Promise<UserInt> {
   const updated = await UserModel.findOneAndUpdate({ _id: user }, updates, {
      new: true,
   });
   if (!updated) {
      throw new AppError(responses.User.updateError, 500);
   }
   return updated as UserInt;
}

export async function getIdUser(email: string): Promise<ObjectId> {
   const user = await UserModel.findOne({ email });
   if (!user) {
      throw new AppError(responses.User.notfound, 404);
   }
   return user._id as ObjectId;
}

export async function getUserByObject(userId: ObjectId): Promise<UserInt> {
   const user = await UserModel.findOne({ _id: userId });
   if (!user) {
      throw new AppError(responses.User.notfound, 404);
   }
   return user as UserInt;
}

export async function getUserById(userId: string): Promise<UserInt> {
   const user = await UserModel.findOne({ _id: userId });
   if (!user) {
      throw new AppError(responses.User.notfound, 404);
   }
   return user as UserInt;
}

export async function findUserByUniqueFields({
   email,
   username,
   name,
   phone,
}: {
   email?: string;
   username?: string;
   name?: string;
   phone?: string;
}): Promise<{ field: string } | void> {
   if (email) {
      const user = await UserModel.findOne({ email });
      if (user) return { field: 'correo electrónico' };
   }
   if (username) {
      const user = await UserModel.findOne({ username });
      if (user) return { field: 'nombre de usuario' };
   }
   if (name) {
      const user = await UserModel.findOne({ name });
      if (user) return { field: 'nombre' };
   }
   if (phone) {
      const user = await UserModel.findOne({ phone });
      if (user) return { field: 'numero de telefono' };
   }
}
