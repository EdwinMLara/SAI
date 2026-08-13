import axios from '@config/axios.config';

import { AdminUser } from '@interfaces/User.interfaces';

/* ------------------ Code ------------------ */

export async function getAllUsers(): Promise<{
  status: number;
  message: string;
  users: AdminUser[];
}> {
  const response = await axios.get('/user/list');
  return {
    status: response.data.status,
    message: response.data.message,
    users: response.data.all?.users ?? [],
  };
}
