import mongose, { Schema } from 'mongoose';
import { UserInterface } from '@interfaces/User.interfaces';

const UserSchema: Schema = new Schema<UserInterface>({
  image: { type: String, required: false, unique: true },
  name: { type: String, required: true, unique: true },
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: false },
  role: { type: String, required: true, unique: false },
});

export default mongose.model<UserInterface>('Users', UserSchema);
