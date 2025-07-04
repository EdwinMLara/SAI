import mongoose, { Schema } from 'mongoose';
import { UserInterface } from '@interfaces/User.interfaces';

const UserSchema: Schema = new Schema<UserInterface>({
  image: { type: String, required: false },
  name: { type: String, required: true },
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

export default mongoose.model<UserInterface>('User', UserSchema);
