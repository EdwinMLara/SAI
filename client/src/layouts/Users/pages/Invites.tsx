import React, { useEffect, useState } from 'react';

import { Loading, Message } from '@ui/index.ui';
import { H1 } from '@components/semantic';

import { useInvites, InviteForm, InviteList } from '../';

const Invites = () => {
  const { invites, isLoading, error, fetchInvites, addInvite, removeInvite } =
    useInvites();

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

  const handleAdd = async (email: string, role: 'admin' | 'user') => {
    try {
      const response = await addInvite(email, role);
      setFeedback({ type: 'success', text: response.message });
    } catch (err) {
      setFeedback({ type: 'error', text: 'No se pudo crear la invitación' });
    }
  };

  const handleDelete = async (email: string) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar la invitación de ${email}?`
    );
    if (!confirmed) return;
    try {
      const response = await removeInvite(email);
      setFeedback({ type: 'success', text: response.message });
    } catch (err) {
      setFeedback({ type: 'error', text: 'No se pudo eliminar la invitación' });
    }
  };

  return (
    <div className="space-y-6">
      <H1>Invitaciones</H1>

      <InviteForm onSubmit={handleAdd} />

      {feedback && (
        <Message type={feedback.type} message={feedback.text} />
      )}

      {isLoading ? (
        <Loading message="Cargando invitaciones..." />
      ) : (
        <InviteList
          invites={invites}
          error={error}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Invites;
