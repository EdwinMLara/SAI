import mongoose, { Schema, Document } from 'mongoose';

import { UserInt } from '@cmm_interfaces/index';

/* ------------------ Code ------------------ */

export interface UserDoc extends UserInt, Document {}

const UserSchema: Schema = new Schema<UserDoc>({
   image: { type: String, required: false },
   name: { type: String, required: true },
   username: { type: String, required: true },
   phone: { type: String, required: true, unique: true },
   email: { type: String, required: true, unique: true, index: true },
   password: { type: String, required: true },
   role: {
      type: String,
      required: true,
      enum: ['admin', 'user'],
   },
});

export default mongoose.model<UserDoc>('User', UserSchema);
