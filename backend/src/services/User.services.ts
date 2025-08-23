import { ObjectId } from 'mongoose';

import UserModel from '@models/User.model';
import { UserChangesInt, UserInt } from '@cmm_interfaces/index';

import responses from '@utils/responses';
import AppError from '@utils/system/AppError';

/**
 * Creates a new user in the database
 * @param user - User data object conforming to UserInt interface
 * @returns Promise<void>
 */
export async function createUser(user: UserInt): Promise<void> {
   const newUser = new UserModel(user);
   await newUser.save();
}

/**
 * Updates user information with partial data and returns the updated user
 * @param user - User ID string
 * @param updates - Partial user data to update
 * @returns Promise<UserInt> - Updated user data
 * @throws AppError if user is not found or update fails
 */
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

/**
 * Retrieves user ObjectId by email address
 * @param email - User email address
 * @returns Promise<ObjectId> - The user's ObjectId
 * @throws AppError if user is not found
 */
export async function getIdUser(email: string): Promise<ObjectId> {
   const user = await UserModel.findOne({ email });
   if (!user) {
      throw new AppError(responses.User.notfound, 404);
   }
   return user._id as ObjectId;
}

/**
 * Retrieves user data by ObjectId
 * @param userId - User ObjectId
 * @returns Promise<UserInt> - The user data
 * @throws AppError if user is not found
 */
export async function getUserByObject(userId: ObjectId): Promise<UserInt> {
   const user = await UserModel.findOne({ _id: userId });
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
