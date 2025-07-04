import { Document } from 'mongoose';

export interface UserInterface extends Document {
  image?: string;
  name: string;
  userName: string;
  phone: number;
  email: string;
  password: string;
  role: 'admin' | 'user';
}
