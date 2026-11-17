import React from 'react';

import { Button, Message } from '@ui/index.ui';
import { SalesNoteInterface } from '@interfaces/SalesNote.interfaces';

import { formatCurrency, formatDate } from '../utils/format';

interface SalesNoteTableProps {
  notes: SalesNoteInterface[];
  error: string;
  onView: (reference: string) => void;
  onFiscal: (reference: string) => void;
  onDelete: (reference: string) => void;
}

const SalesNoteTable: React.FC<SalesNoteTableProps> = ({
  notes,
  error,
  onView,
  onFiscal,
  onDelete,
}) => {
  if (error) {
    return <Message type="error" message={error} />;
  }

  if (notes.length === 0) {
    return (
      <Message
        type="neutral"
        message="No hay notas de venta registradas. Crea la primera para comenzar."
      />
    );
  }

  return (
    <div className="bg-card p-6 border border-light rounded-md overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-border-light text-text-secondary dark:text-text-dark-secondary">
            <th className="py-3 px-2">Referencia</th>
            <th className="py-3 px-2">Cliente</th>
            <th className="py-3 px-2">Fecha</th>
            <th className="py-3 px-2 text-right">Total</th>
            <th className="py-3 px-2">Estado</th>
            <th className="py-3 px-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note) => (
            <tr
              key={note.reference}
              className="border-b border-border-light last:border-0"
            >
              <td className="py-3 px-2 font-medium text-primary-color">
                {note.reference}
              </td>
              <td className="py-3 px-2">{note.customer.name}</td>
              <td className="py-3 px-2">{formatDate(note.date)}</td>
              <td className="py-3 px-2 text-right tabular-nums font-medium">
                {formatCurrency(note.total)}
              </td>
              <td className="py-3 px-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    note.status === 'stamped'
                      ? 'bg-success-light text-success'
                      : 'bg-warning-light text-warning'
                  }`}
                >
                  {note.status === 'stamped' ? 'Timbrada' : 'Borrador'}
                </span>
              </td>
              <td className="py-3 px-2">
                <div className="flex gap-2 justify-end flex-wrap">
                  <Button
                    variant="secondary"
                    className="h-9 min-h-9 px-3 text-xs"
                    onClick={() => onView(note.reference)}
                  >
                    Ver
                  </Button>
                  <Button
                    variant="secondary"
                    className="h-9 min-h-9 px-3 text-xs"
                    onClick={() => onFiscal(note.reference)}
                  >
                    Sello fiscal
                  </Button>
                  <button
                    onClick={() => onDelete(note.reference)}
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

export default SalesNoteTable;
