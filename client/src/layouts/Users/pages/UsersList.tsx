import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Loading } from '@ui/index.ui';
import { H1 } from '@components/semantic';

import { useUsers, UserListTable } from '../';

const UsersList = () => {
  const { users, isLoading, error, fetchUsers } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <H1>Usuarios</H1>
        <Link
          to="/users/invites"
          className="text-brand font-semibold hover:underline text-sm"
        >
          Enviar invitación +
        </Link>
      </div>

      {isLoading ? (
        <Loading message="Cargando usuarios..." />
      ) : (
        <UserListTable users={users} error={error} />
      )}
    </div>
  );
};

export default UsersList;
