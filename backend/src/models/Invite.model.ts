import mongoose, { Schema } from 'mongoose';
import { Invite } from '../interfaces/Invite.interfaces';

const InviteSchema: Schema = new Schema<Invite>({
  invitedBy: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

export default mongoose.model<Invite>('invites', InviteSchema);
