export interface InviteInt {
   senderId: string;
   invitedEmail: string;
   asignedRole: 'admin' | 'user';
}

export interface NewInviteInt {
   invitedEmail: string;
   asignedRole: 'admin' | 'user';
}
