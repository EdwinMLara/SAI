import { ObjectId } from 'mongoose';

export interface UserInfoAtToken {
   id: ObjectId;
   role: 'admin' | 'user';
}
