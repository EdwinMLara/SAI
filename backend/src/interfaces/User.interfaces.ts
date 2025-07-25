import { Document } from 'mongoose';

export interface UserInterface extends Document {
  image?: string;
  name: string;
  userName: string;
  phone: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface UserChanges {
  image: string;
  name: string;
  userName: string;
  phone: string;
  password: string;
  email: string;
}

export interface PublicUserData {
  image?: string;
  name: string;
  userName: string;
  phone: string;
  email: string;
  role: 'admin' | 'user';
}
