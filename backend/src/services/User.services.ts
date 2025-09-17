import { Types, isValidObjectId } from 'mongoose';

import UserModel from '@models/User.model';
import {
   UserChangesInt,
   NewUserInt,
   PublicUserInt,
   UserInt,
} from '@cmm_interfaces/index';

import supabase from '@config/supabase';
import AppError from '@utils/system/AppError';
import responses from '@utils/system/responses';

import { encrypt } from '@utils/auth/crypt';
import { getInvite, removeInvite } from '@services/Invite.services';

import { QueryResInt } from '@interfaces/QueryResponse';
import { pagination, sorting } from '@utils/request';

/* ------------------ Code ------------------ */

export async function searchUsers(
   query: any
): Promise<QueryResInt<PublicUserInt>> {
   const sorter = sorting(query);
   const { page, limit } = pagination(query);
   const skip = (page - 1) * limit;

   const alerts = await UserModel.find().skip(skip).sort(sorter).limit(limit);
   const total = await UserModel.countDocuments();

   return {
      data: alerts.map((user: any) => ({
         _id: user._id.toString(),
         image: user.image ?? '',
         name: user.name,
         username: user.username,
         phone: user.phone,
         email: user.email,
         role: user.role,
      })),
      pagination: {
         total,
         page,
         limit,
         totalPages: Math.ceil(total / limit),
      },
   };
}

/**
 * Creates a new user in the database
 * @param user - User data object conforming to UserInt interface
 * @returns Promise<void>
 */
export async function createUser(user: NewUserInt): Promise<void> {
   const newUser = new UserModel(user);

   const invite = await getInvite(user.email);
   newUser.role = invite.asignedRole;

   newUser.password = await encrypt(user.password);

   await newUser.save();
   await removeInvite(user.email);
}

/**
 * Updates user information with partial data and returns the updated user
 * @param user - User ID string
 * @param updates - Partial user data to update
 * @returns Promise<UserInt> - Updated user data
 * @throws AppError if user is not found or update fails
 */
export async function updatedUser(
   updates: Partial<UserChangesInt>,
   userId: string
): Promise<PublicUserInt> {
   const updated = await UserModel.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) },
      updates,
      { new: true }
   ).lean();

   if (!updated) {
      throw new AppError(responses.User.updateError, 500);
   }

   const publicUser: PublicUserInt = {
      _id: updated._id.toString(),
      image: updated.image ?? '',
      name: updated.name,
      username: updated.username,
      phone: updated.phone,
      email: updated.email,
      role: updated.role,
   };

   return publicUser;
}

/**
 * Searches for existing users with the same unique field values
 * Checks email, username, name, and phone for uniqueness
 * @param fields - Object containing user fields to check for uniqueness
 * @returns Promise<{field: string} | void> - Returns field name if duplicate found, void if unique
 */
export async function checkFields({
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

/**
 * Changes the role of a user by user ID.
 * @param role - The new role to assign ('admin' or 'user').
 * @param userId - The ID of the user whose role will be changed.
 * @throws AppError if the user is not found.
 */
export async function changeRole(
   role: 'admin' | 'user',
   userId: string
): Promise<void> {
   const user = await UserModel.findById(userId);

   if (!user) {
      throw new AppError(responses.System.serverError, 500);
   }

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
export async function userByIndexed(index: string): Promise<PublicUserInt> {
   const query = isValidObjectId(index)
      ? { _id: new Types.ObjectId(index) }
      : { email: index };

   const user = await UserModel.findOne(query).lean();
   if (!user) {
      throw new AppError(responses.User.notfound, 404);
   }

   const publicUser: PublicUserInt = {
      _id: user._id.toString(),
      image: user.image ?? '',
      name: user.name,
      username: user.username,
      phone: user.phone,
      email: user.email,
      role: user.role,
   };

   return publicUser;
}

export async function returnUser(index: string): Promise<UserInt> {
   const query = isValidObjectId(index)
      ? { _id: new Types.ObjectId(index) }
      : { email: index };

   const user = await UserModel.findOne(query).lean();
   if (!user) {
      throw new AppError(responses.User.notfound, 404);
   }

   const mappedUser: UserInt = {
      _id: user._id.toString(),
      image: user.image ?? '',
      name: user.name,
      username: user.username,
      phone: user.phone,
      email: user.email,
      password: user.password,
      role: user.role,
   };
   return mappedUser;
}

export async function changeImageProfile(
   file: Express.Multer.File,
   filename: string
): Promise<string> {
   const { error } = await supabase.storage
      .from('profile-pictures')
      .upload(filename, file.buffer, {
         contentType: file.mimetype,
         upsert: true,
      });

   if (error) {
      throw new AppError(responses.Document.uploadError, 500, error);
   }

   const { data } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(filename);

   return data.publicUrl;
}
