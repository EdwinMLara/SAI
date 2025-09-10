import { Types, isValidObjectId } from 'mongoose';

import UserModel from '@models/User.model';
import { compareHash } from '@utils/auth/crypt';
import {
   UserChangesInt,
   UserInt,
   NewUserInt,
   PublicUserInt,
} from '@cmm_interfaces/index';

import responses from '@utils/system/responses';
import AppError from '@utils/system/AppError';
/* ------------------ Code ------------------ */

/**
 * Creates a new user in the database
 * @param user - User data object conforming to UserInt interface
 * @returns Promise<void>
 */
export async function createUser(user: NewUserInt): Promise<PublicUserInt> {
   const newUser = new UserModel(user);
   await newUser.save();
   const userObj = newUser.toObject() as UserInt & { _id: any };
   return { ...userObj, _id: userObj._id.toString() };
}

/**
 * Updates user information with partial data and returns the updated user
 * @param user - User ID string
 * @param updates - Partial user data to update
 * @returns Promise<UserInt> - Updated user data
 * @throws AppError if user is not found or update fails
 */
export async function updatedUser(
   userId: string,
   updates: Partial<UserChangesInt>
): Promise<PublicUserInt> {
   const updated = await UserModel.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) },
      updates
   );
   if (!updated) throw new AppError(responses.User.updateError, 500);
   return updated as UserInt;
}

/**
 * Searches for existing users with the same unique field values
 * Checks email, username, name, and phone for uniqueness
 * @param fields - Object containing user fields to check for uniqueness
 * @returns Promise<{field: string} | void> - Returns field name if duplicate found, void if unique
 */
export async function comprobeUniqueFields({
   email,
   username,
   phone,
}: {
   email?: string;
   username?: string;
   phone?: string;
}): Promise<string | void> {
   if (email) {
      const user = await UserModel.findOne({ email });
      if (user) return 'correo electrónico';
   }
   if (username) {
      const user = await UserModel.findOne({ username });
      if (user) return 'nombre de usuario';
   }
   if (phone) {
      const user = await UserModel.findOne({ phone });
      if (user) return 'numero de telefono';
   }
}

export async function changeRole(
   role: 'admin' | 'user',
   userId: string
): Promise<void> {
   const user = await UserModel.findById(userId);
   if (!user) throw new AppError(responses.System.serverError, 500);
   user.role = role;
   await user.save();
}

/**
 * Returns the user object for the given email or ObjectId, including the user's id as a string.
 *
 * @param index The user's email or ObjectId as string.
 * @returns The user object with an id property.
 * @throws {AppError} If no user is found with the provided value.
 */
export async function userByIndexed(index: string): Promise<UserInt> {
   const query = isValidObjectId(index)
      ? { _id: new Types.ObjectId(index) }
      : { email: index };
   const user = await UserModel.findOne(query).lean();
   if (!user) throw new AppError(responses.User.notfound, 404);
   return { ...user, _id: user._id.toString() };
}
