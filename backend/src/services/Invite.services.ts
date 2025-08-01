import { ObjectId } from 'mongoose';

import InviteModel from '@models/Invite.model';
import { InviteInterface } from '@interfaces/Invite.interfaces';

/* ------------------ Code ------------------ */

export async function createInvite(
  ref: ObjectId,
  email: string,
  role: 'admin' | 'user'
): Promise<void> {
  try {
    const invite = { ref, email, role };
    const newInvite = new InviteModel(invite);
    await newInvite.save();
  } catch (error) {
    throw error;
  }
}

export async function getInvites(user: ObjectId): Promise<{
  data?: InviteInterface[];
}> {
  try {
    const invites = await InviteModel.find({ ref: user }).lean();
    return { data: invites as InviteInterface[] };
  } catch (error) {
    throw error;
  }
}

export async function removeInvite(email: string): Promise<void> {
  try {
    await InviteModel.findOneAndDelete({ email });
  } catch (error) {
    throw error;
  }
}

export async function hasInvite(email: string): Promise<boolean> {
  try {
    const found = await InviteModel.findOne({ email }).lean();
    return !!found;
  } catch (error) {
    throw error;
  }
}

export async function getInvite(email: string): Promise<InviteInterface> {
  try {
    const invite = await InviteModel.findOne({ email }).lean();
    return invite as InviteInterface;
  } catch (error) {
    throw error;
  }
}
