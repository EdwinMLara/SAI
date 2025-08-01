import { Document, ObjectId } from 'mongoose';

export interface InviteInterface extends Document {
  ref: ObjectId;
  email: string;
  role: 'admin' | 'user';
}
