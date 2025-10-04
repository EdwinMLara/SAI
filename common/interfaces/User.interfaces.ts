import { RoleType } from '../types';

/* ------ User Account Info ------ */

export interface UserAccountInfo {
   _id: string;
   image?: string;
   name: string;
   username: string;
   email: string;
   role: RoleType;
   password: string;
}

export type UserAccountBaseInfo = Omit<UserAccountInfo, '_id' | 'role'>;

export type UserAccountInfoPublic = Omit<UserAccountInfo, 'pasword'>;

/* ------ User Gestion by Admin ------ */

interface AdminChange {
   userId: string;
}

export interface AdminChangeUserRole extends AdminChange {
   newRole: RoleType;
}

export interface AdminChangeUserPassword extends AdminChange {
   reset: boolean;
}
