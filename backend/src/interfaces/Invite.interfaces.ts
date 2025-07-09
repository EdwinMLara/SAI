import { Document } from 'mongoose';

export interface Invite extends Document {
  invitedBy: string;
  email: string;
  role: 'admin' | 'user';
}
