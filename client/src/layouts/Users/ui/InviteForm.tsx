import React, { useState } from 'react';

import { Button, Input } from '@ui/index.ui';

interface InviteFormProps {
  onSubmit: (email: string, role: 'admin' | 'user') => Promise<void>;
}

const InviteForm: React.FC<InviteFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) return;

    setIsSubmitting(true);
    try {
      await onSubmit(trimmed, role);
      setEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card p-6 border border-light rounded-md">
      <h3 className="text-lg font-semibold text-primary-color mb-4">
        Nueva invitación
      </h3>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
      >
        <label className="flex flex-col gap-1 text-sm">
          Correo electrónico
          <Input
            type="email"
            placeholder="correo@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Rol
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
            className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-background-tertiary dark:bg-background-dark-tertiary text-text-primary dark:text-text-dark-primary focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </label>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Enviando...' : 'Enviar invitación'}
        </Button>
      </form>
    </div>
  );
};

export default InviteForm;
