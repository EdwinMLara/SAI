import mongoose, { Schema } from 'mongoose';
import { Invite } from '../interfaces/Invite.interfaces';

const InviteSchema: Schema = new Schema<Invite>({
  invitedBy: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ['admin', 'user'],
    required: true,
  },
});

export default mongoose.model<Invite>('invites', InviteSchema);
