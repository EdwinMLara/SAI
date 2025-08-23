import mongoose, { Schema } from 'mongoose';
import { InviteDocument } from '@interfaces/ExtendsModel';

/* ------------------ Code ------------------ */

const InviteSchema: Schema = new Schema<InviteDocument>({
   senderId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
   invitedEmail: { type: String, required: true, unique: true, index: true },
   asignedRole: {
      type: String,
      enum: ['super', 'admin', 'user'],
      required: true,
   },
});

export default mongoose.model<InviteDocument>('Invite', InviteSchema);
