export interface InviteInt {
  senderId: unknown;
  invitedEmail: string;
  asignedRole: 'super' | 'admin' | 'user';
}
