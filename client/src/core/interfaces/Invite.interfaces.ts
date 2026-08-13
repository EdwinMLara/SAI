export type InviteRole = 'admin' | 'user';

export interface InviteInterface {
  _id: string;
  email: string;
  role: InviteRole;
}
