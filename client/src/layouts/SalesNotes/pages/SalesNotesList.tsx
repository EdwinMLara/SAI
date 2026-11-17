import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { H1 } from '@components/semantic';
import { Button, Loading, Message } from '@ui/index.ui';

import { useSalesNotes, SalesNoteTable } from '../';

const SalesNotesList = () => {
  const navigate = useNavigate();
  const {
    notes,
    isLoading,
    error,
    total,
    totalPages,
    page,
    limit,
    fetchNotes,
    goToPage,
    remove,
  } = useSalesNotes();
  const [actionError, setActionError] = useState<string>('');

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleDelete = async (reference: string) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar la nota ${reference}?`
    );
    if (!confirmed) return;

    setActionError('');
    try {
      await remove(reference);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'No se pudo eliminar la nota'
      );
    }
  };

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <H1>Notas de venta</H1>
        <Link
          to="/sales-notes/new"
          className="text-brand font-semibold hover:underline text-sm"
        >
          Nueva nota +
        </Link>
      </div>

      {actionError && <Message type="error" message={actionError} />}

      {isLoading ? (
        <Loading message="Cargando notas de venta..." />
      ) : (
        <>
          <SalesNoteTable
            notes={notes}
            error={error}
            onView={(reference) =>
              navigate(`/sales-notes/${encodeURIComponent(reference)}`)
            }
            onFiscal={(reference) =>
              navigate(
                `/sales-notes/${encodeURIComponent(reference)}/fiscal`
              )
            }
            onDelete={handleDelete}
          />

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-4 border border-light rounded-md">
              <span className="text-sm text-text-secondary">
                Mostrando {start}-{end} de {total} notas
              </span>
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  className="h-9 min-h-9 px-3 text-xs"
                  disabled={page <= 1}
                  onClick={() => goToPage(page - 1)}
                >
                  Anterior
                </Button>
                <span className="text-sm text-text-secondary">
                  Página {page} de {totalPages}
                </span>
                <Button
                  variant="secondary"
                  className="h-9 min-h-9 px-3 text-xs"
                  disabled={page >= totalPages}
                  onClick={() => goToPage(page + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SalesNotesList;
