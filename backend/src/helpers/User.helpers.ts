import { ObjectId } from 'mongoose';

import { hasInvite, getInvite } from '@services/Invite.services';
import { findUserByUniqueFields } from '@services/User.services';
import UserModel from '@models/User.model';
import AppError from '@utils/AppError';
import responses from '@responses';
import {
  UserChanges,
  UserInterface,
  PublicUserData,
} from '@interfaces/User.interfaces';

/* ------------------ Code ------------------ */

export async function existsUserByEmail(email: string): Promise<boolean> {
  try {
    const exist = await UserModel.findOne({ email });
    return !!exist;
  } catch (error) {
    throw error;
  }
}

export async function existsUserById(user: ObjectId): Promise<boolean> {
  try {
    const exist = await UserModel.findById(user);
    return !!exist;
  } catch (error) {
    throw error;
  }
}

export async function comprobeInvite(email: string): Promise<void> {
  try {
    const exist = await hasInvite(email);
    if (!exist) {
      throw new AppError(responses.Invite.notWasInvite, 401);
    }
  } catch (error) {
    throw error;
  }
}

export async function findRole(email: string): Promise<'admin' | 'user'> {
  try {
    const invite = await getInvite(email);
    if (!invite) {
      throw new AppError(responses.Invite.notWasInvite, 401);
    }
    return invite.role;
  } catch (error) {
    throw error;
  }
}

export async function returnUser(user: UserInterface): Promise<PublicUserData> {
  try {
    const { image, name, userName, phone, email, role } = user;
    return { image, name, userName, phone, email, role };
  } catch (error) {
    throw error;
  }
}

export async function comprobeUnicity(user: UserInterface): Promise<void> {
  try {
    const result = await findUserByUniqueFields({
      email: user.email,
      username: user.userName,
      name: user.name,
      phone: user.phone,
    });
    if (result) {
      throw new AppError(`El ${result.field} ya está en uso.`);
    }
  } catch (error) {
    throw error;
  }
}
