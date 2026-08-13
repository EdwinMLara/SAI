import { useState, useCallback } from 'react';

import { InviteInterface } from '@interfaces/Invite.interfaces';
import * as services from '@services/Invites.services';

interface UseInvitesReturn {
  invites: InviteInterface[];
  isLoading: boolean;
  error: string;
  fetchInvites: () => Promise<void>;
  addInvite: (
    email: string,
    role: 'admin' | 'user'
  ) => Promise<{ status: number; message: string }>;
  removeInvite: (email: string) => Promise<{ status: number; message: string }>;
}

const useInvites = (): UseInvitesReturn => {
  const [invites, setInvites] = useState<InviteInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchInvites = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await services.getInvites();
      setInvites(response.invites);
    } catch (err) {
      setError('No se pudieron cargar las invitaciones');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addInvite = async (email: string, role: 'admin' | 'user') => {
    const response = await services.createInvite(email, role);
    await fetchInvites();
    return response;
  };

  const removeInvite = async (email: string) => {
    const response = await services.deleteInvite(email);
    setInvites((prev) => prev.filter((invite) => invite.email !== email));
    return response;
  };

  return {
    invites,
    isLoading,
    error,
    fetchInvites,
    addInvite,
    removeInvite,
  };
};

export default useInvites;
