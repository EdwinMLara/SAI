import { ObjectId } from 'mongoose';

import UserModel from '@models/User.model';
import { UserChanges, UserInterface } from '@interfaces/User.interfaces';

import responses from '@responses';
import AppError from '@utils/AppError';

/* ------------------ Code ------------------ */

export async function createUser(user: UserInterface): Promise<void> {
  try {
    const newUser = new UserModel(user);
    await newUser.save();
  } catch (error) {
    throw error;
  }
}

export async function updatedUser(
  user: string,
  updates: Partial<UserChanges>
): Promise<UserInterface> {
  try {
    const updated = await UserModel.findOneAndUpdate({ _id: user }, updates, {
      new: true,
    });
    if (!updated) {
      throw new AppError(responses.User.updateError, 500);
    }
    return updated as UserInterface;
  } catch (error) {
    throw error;
  }
}

export async function getIdUser(email: string): Promise<ObjectId> {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new AppError(responses.User.notfound, 404);
    }
    return user._id as ObjectId;
  } catch (error) {
    throw error;
  }
}

export async function getUserByObject(
  userId: ObjectId
): Promise<UserInterface> {
  try {
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      throw new AppError(responses.User.notfound, 404);
    }
    return user as UserInterface;
  } catch (error) {
    throw error;
  }
}

export async function getUserById(userId: string): Promise<UserInterface> {
  try {
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      throw new AppError(responses.User.notfound, 404);
    }
    return user as UserInterface;
  } catch (error) {
    throw error;
  }
}
