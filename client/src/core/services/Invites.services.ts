import axios from '@config/axios.config';

import { InviteInterface } from '@interfaces/Invite.interfaces';

/* ------------------ Code ------------------ */

export async function createInvite(
  email: string,
  role: 'admin' | 'user'
): Promise<{ status: number; message: string }> {
  const response = await axios.post('/admin/invites', { email, role });
  return { status: response.data.status, message: response.data.message };
}

export async function getInvites(): Promise<{
  status: number;
  message: string;
  invites: InviteInterface[];
}> {
  const response = await axios.get('/admin/invites');
  return {
    status: response.data.status,
    message: response.data.message,
    invites: response.data.all?.invites ?? [],
  };
}

export async function deleteInvite(
  email: string
): Promise<{ status: number; message: string }> {
  const response = await axios.delete('/admin/invites', { data: { email } });
  return { status: response.data.status, message: response.data.message };
}
