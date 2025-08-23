import { ObjectId } from 'mongoose';

import InviteModel from '@models/Invite.model';
import { InviteInt } from '@cmm_interfaces/index';

/* ------------------ Code ------------------ */

export async function createInvite(
   senderId: ObjectId,
   invitedEmail: string,
   asignedRole: 'super' | 'admin' | 'user'
): Promise<void> {
   const invite = { senderId, invitedEmail, asignedRole };
   const newInvite = new InviteModel(invite);
   await newInvite.save();
}

export async function getInvites(user: ObjectId): Promise<{
   data?: InviteInt[];
}> {
   const invites = await InviteModel.find({ senderId: user }).lean();
   return { data: invites as InviteInt[] };
}

export async function removeInvite(email: string): Promise<void> {
   await InviteModel.findOneAndDelete({ invitedEmail: email });
}

export async function hasInvite(email: string): Promise<boolean> {
   const found = await InviteModel.findOne({ invitedEmail: email }).lean();
   return !!found;
}

export async function getInvite(email: string): Promise<InviteInt> {
   const invite = await InviteModel.findOne({ invitedEmail: email }).lean();
   return invite as InviteInt;
}
