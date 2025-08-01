import mongoose, { Schema } from 'mongoose';
import { InviteInterface } from '../interfaces/Invite.interfaces';

const InviteSchema: Schema = new Schema<InviteInterface>({
  ref: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ['admin', 'user'],
    required: true,
  },
});

export default mongoose.model<InviteInterface>('invites', InviteSchema);
