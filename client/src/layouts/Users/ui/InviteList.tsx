import React from 'react';

import { Message } from '@ui/index.ui';
import { InviteInterface } from '@interfaces/Invite.interfaces';

interface InviteListProps {
  invites: InviteInterface[];
  error: string;
  onDelete: (email: string) => void;
}

const InviteList: React.FC<InviteListProps> = ({
  invites,
  error,
  onDelete,
}) => {
  if (error) {
    return <Message type="error" message={error} />;
  }

  if (invites.length === 0) {
    return <Message type="neutral" message="No hay invitaciones pendientes" />;
  }

  return (
    <div className="bg-card p-6 border border-light rounded-md overflow-x-auto">
      <h3 className="text-lg font-semibold text-primary-color mb-4">
        Invitaciones pendientes ({invites.length})
      </h3>

      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-border-light text-text-secondary dark:text-text-dark-secondary">
            <th className="py-3 px-2">Correo</th>
            <th className="py-3 px-2">Rol</th>
            <th className="py-3 px-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {invites.map((invite) => (
            <tr
              key={invite._id || invite.email}
              className="border-b border-border-light last:border-0"
            >
              <td className="py-3 px-2">{invite.email}</td>
              <td className="py-3 px-2">
                {invite.role === 'admin' ? 'Administrador' : 'Usuario'}
              </td>
              <td className="py-3 px-2">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => onDelete(invite.email)}
                    className="flex items-center justify-center rounded-md font-sans font-semibold h-9 min-h-9 px-3 text-xs text-error hover:bg-error-light transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InviteList;
