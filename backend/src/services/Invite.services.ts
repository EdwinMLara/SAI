import { Types } from 'mongoose';

import InviteModel from '@models/Invite.model';
import { InviteInt, NewInviteInt } from '@cmm_interfaces/index';
import AppError from '@utils/system/AppError';
import responses from '@utils/system/responses';

/* ------------------ Code ------------------ */

/**
 * Creates a new invitation in the database
 * @param senderId - ObjectId of the user sending the invitation
 * @param invitedEmail - Email address of the person being invited
 * @param asignedRole - Role to be assigned to the invited user ('super' | 'admin' | 'user')
 * @returns Promise<void>
 */
export async function createInvite(invite: InviteInt): Promise<void> {
   const newInvite = new InviteModel(invite);
   await newInvite.save();
}

/**
 * Retrieves all invitations sent by a specific user
 * @param user - ObjectId of the user whose sent invitations to retrieve
 * @returns Promise containing array of invitation data
 */
export async function getInvites(user: string): Promise<InviteInt[] | null> {
   const userId = new Types.ObjectId(user);
   const invites = await InviteModel.find({ senderId: userId }).lean();
   return invites;
}

/**
 * Removes an invitation from the database
 * @param email - Email address of the invitation to remove
 * @returns Promise<void>
 */
export async function removeInvite(email: string): Promise<void> {
   await InviteModel.findOneAndDelete({ invitedEmail: email });
}

/**
 * Checks if an invitation exists for a specific email address
 * @param email - Email address to check for existing invitation
 * @returns Promise<boolean> - True if invitation exists, false otherwise
 */
export async function hasInvite(email: string): Promise<boolean> {
   const found = await InviteModel.findOne({ invitedEmail: email }).lean();
   return !!found;
}

/**
 * Retrieves a specific invitation by email address
 * @param email - Email address of the invitation to retrieve
 * @returns Promise<InviteInt> - The invitation data
 */
export async function getInvite(email: string): Promise<InviteInt> {
   const invite = await InviteModel.findOne({ invitedEmail: email }).lean();

   if (!invite) {
      throw new AppError(responses.User.inviteNotFound, 404);
   }

   return invite as InviteInt;
}
