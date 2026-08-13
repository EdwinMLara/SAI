import { useState, useCallback } from 'react';

import { AdminUser } from '@interfaces/User.interfaces';
import * as services from '@services/Users.services';

interface UseUsersReturn {
  users: AdminUser[];
  isLoading: boolean;
  error: string;
  fetchUsers: () => Promise<void>;
}

const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await services.getAllUsers();
      setUsers(response.users);
    } catch (err) {
      setError('No se pudieron cargar los usuarios');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { users, isLoading, error, fetchUsers };
};

export default useUsers;
