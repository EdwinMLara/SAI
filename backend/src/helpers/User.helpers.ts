import { ObjectId } from 'mongoose';

import { hasInvite, getInvite } from '@services/Invite.services';
import { findUserByUniqueFields } from '@services/User.services';
import UserModel from '@models/User.model';
import AppError from '@utils/system/AppError';
import responses from '@utils/responses';
import { UserInt, PublicUserInt } from '@cmm_interfaces/index';

/**
 * Checks if a user exists by email address
 * @param email - Email address to check
 * @returns Promise<boolean> - True if user exists, false otherwise
 */
export async function existsUserByEmail(email: string): Promise<boolean> {
   const exist = await UserModel.findOne({ email });
   return !!exist;
}

/**
 * Checks if a user exists by ObjectId
 * @param user - ObjectId of the user to check
 * @returns Promise<boolean> - True if user exists, false otherwise
 */
export async function existsUserById(user: ObjectId): Promise<boolean> {
   const exist = await UserModel.findById(user);
   return !!exist;
}

/**
 * Validates that a user has a valid invitation before registration
 * @param email - Email address to check for invitation
 * @returns Promise<void>
 * @throws AppError if invitation does not exist
 */
export async function comprobeInvite(email: string): Promise<void> {
   const exist = await hasInvite(email);
   if (!exist) {
      throw new AppError(responses.Invite.notWasInvite, 401);
   }
}

/**
 * Retrieves the assigned role from a user invitation
 * @param email - Email address to find role for
 * @returns Promise<'super' | 'admin' | 'user'> - Role assigned in the invitation
 * @throws AppError if invitation does not exist
 */
export async function findRole(
   email: string
): Promise<'super' | 'admin' | 'user'> {
   const invite = await getInvite(email);
   if (!invite) {
      throw new AppError(responses.Invite.notWasInvite, 401);
   }
   return invite.asignedRole;
}

/**
 * Creates a public user object removing sensitive information
 * @param user - Full user object with all properties
 * @returns Promise<PublicUserInt> - Public user object without sensitive data
 */
export async function returnUser(user: UserInt): Promise<PublicUserInt> {
   const { image, name, username, phone, email, role } = user;
   return { image: image ?? '', name, username, phone, email, role };
}

/**
 * Validates that all user fields are unique before creation
 * Checks email, username, name, and phone for uniqueness
 * @param user - User object containing fields to validate
 * @returns Promise<void>
 * @throws AppError if any field is already in use
 */
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
