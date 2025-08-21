import { ObjectId } from 'mongoose';

import InviteModel from '@models/Invite.model';
import { InviteInt } from '@cmm_interfaces/index.interfaces';

/* ------------------ Code ------------------ */

export async function createInvite(
  senderId: ObjectId,
  invitedEmail: string,
  asignedRole: 'super' | 'admin' | 'user'
): Promise<void> {
  try {
    const invite = { senderId, invitedEmail, asignedRole };
    const newInvite = new InviteModel(invite);
    await newInvite.save();
  } catch (error) {
    throw error;
  }
}

export async function getInvites(user: ObjectId): Promise<{
  data?: InviteInt[];
}> {
  try {
    const invites = await InviteModel.find({ senderId: user }).lean();
    return { data: invites as InviteInt[] };
  } catch (error) {
    throw error;
  }
}

export async function removeInvite(email: string): Promise<void> {
  try {
    await InviteModel.findOneAndDelete({ invitedEmail: email });
  } catch (error) {
    throw error;
  }
}

export async function hasInvite(email: string): Promise<boolean> {
  try {
    const found = await InviteModel.findOne({ invitedEmail: email }).lean();
    return !!found;
  } catch (error) {
    throw error;
  }
}

export async function getInvite(email: string): Promise<InviteInt> {
  try {
    const invite = await InviteModel.findOne({ invitedEmail: email }).lean();
    return invite as InviteInt;
  } catch (error) {
    throw error;
  }
}
