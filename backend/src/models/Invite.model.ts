import mongoose, { Schema, Document } from 'mongoose';

import { InviteInt } from '@cmm_interfaces/index';

/* ------------------ Code ------------------ */

export interface InviteDoc extends InviteInt, Document {}

const InviteSchema: Schema = new Schema<InviteDoc>({
   senderId: { type: String, required: true, ref: 'User' },
   invitedEmail: { type: String, required: true, unique: true, index: true },
   asignedRole: {
      type: String,
      enum: ['admin', 'user'],
      required: true,
   },
});

export default mongoose.model<InviteDoc>('Invite', InviteSchema);
