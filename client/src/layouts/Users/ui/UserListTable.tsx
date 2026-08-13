import React from 'react';

import { Message } from '@ui/index.ui';
import { AdminUser } from '@interfaces/User.interfaces';

interface UserListTableProps {
  users: AdminUser[];
  error: string;
}

const UserListTable: React.FC<UserListTableProps> = ({ users, error }) => {
  if (error) {
    return <Message type="error" message={error} />;
  }

  if (users.length === 0) {
    return <Message type="neutral" message="No hay usuarios registrados" />;
  }

  return (
    <div className="bg-card p-6 border border-light rounded-md overflow-x-auto">
      <h3 className="text-lg font-semibold text-primary-color mb-4">
        Usuarios registrados ({users.length})
      </h3>

      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-border-light text-text-secondary dark:text-text-dark-secondary">
            <th className="py-3 px-2">Nombre</th>
            <th className="py-3 px-2">Usuario</th>
            <th className="py-3 px-2">Correo</th>
            <th className="py-3 px-2">Teléfono</th>
            <th className="py-3 px-2">Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.email}
              className="border-b border-border-light last:border-0"
            >
              <td className="py-3 px-2 font-medium text-primary-color">
                {user.name}
              </td>
              <td className="py-3 px-2">{user.userName || '—'}</td>
              <td className="py-3 px-2">{user.email}</td>
              <td className="py-3 px-2">{user.phone || '—'}</td>
              <td className="py-3 px-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
                    user.role === 'admin'
                      ? 'bg-brand-light text-brand border-brand/20'
                      : 'bg-background-secondary dark:bg-background-dark-secondary text-text-secondary border-border-light'
                  }`}
                >
                  {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserListTable;
