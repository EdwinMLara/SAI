import { Types, isValidObjectId } from 'mongoose';

import UserModel from '@models/User.model';
import { compareHash } from '@utils/auth/crypt';
import { UserChangesInt, UserInt, NewUserInt } from '@cmm_interfaces/index';

import responses from '@utils/system/responses';
import AppError from '@utils/system/AppError';
/* ------------------ Code ------------------ */

/**
 * Creates a new user in the database
 * @param user - User data object conforming to UserInt interface
 * @returns Promise<void>
 */
export async function createUser(user: NewUserInt): Promise<UserInt> {
   const newUser = new UserModel(user);
   await newUser.save();
   return newUser;
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
): Promise<UserInt> {
   const updated = await UserModel.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) },
      updates
   );
   if (!updated) throw new AppError(responses.User.updateError, 500);
   return updated as UserInt;
}

/**
 * Retrieves user ObjectId by email address
 * @param email - User email address
 * @returns Promise<ObjectId> - The user's ObjectId
 * @throws AppError if user is not found
 */
export async function getIdUser(email: string): Promise<string> {
   const user = await UserModel.findOne({ email });
   if (!user) {
      throw new AppError(responses.User.notfound, 404);
   }
   return user._id as string;
}

/**
 * Retrieves user data by ObjectId
 * @param userId - User ObjectId
 * @returns Promise<UserInt> - The user data
 * @throws AppError if user is not found
 */
export async function getUserByObject(userId: string): Promise<UserInt> {
   const user = await UserModel.findOne({ _id: new Types.ObjectId(userId) });
   if (!user) {
      throw new AppError(responses.User.notfound, 404);
   }
   return user as UserInt;
}

/**
 * Retrieves user data by string ID
 * @param userId - User ID as string
 * @returns Promise<UserInt> - The user data
 * @throws AppError if user is not found
 */
export async function getUserById(userId: string): Promise<UserInt> {
   const user = await UserModel.findOne({ _id: userId });
   if (!user) {
      throw new AppError(responses.User.notfound, 404);
   }
   return user as UserInt;
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

export async function userByEmail(email: string): Promise<UserInt | null> {
   return await UserModel.findOne({ email }).lean();
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
