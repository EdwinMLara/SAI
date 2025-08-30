import mongoose, { Schema } from 'mongoose';
import { UserDocument } from '@interfaces/ExtendsModel';

const UserSchema: Schema = new Schema<UserDocument>({
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

export default mongoose.model<UserDocument>('User', UserSchema);
