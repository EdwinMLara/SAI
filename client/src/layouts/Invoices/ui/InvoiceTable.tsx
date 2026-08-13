import React from 'react';

import { Button, Message } from '@ui/index.ui';
import { InvoiceInterface } from '@interfaces/Invoice.interfaces';

interface InvoiceTableProps {
  invoices: InvoiceInterface[];
  error: string;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

interface InvoiceGroup {
  key: string;
  label: string;
  invoices: InvoiceInterface[];
}

const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const formatDate = (date: Date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const groupByMonth = (invoices: InvoiceInterface[]): InvoiceGroup[] => {
  const groups = new Map<string, InvoiceGroup>();

  const push = (key: string, label: string, invoice: InvoiceInterface) => {
    if (!groups.has(key)) {
      groups.set(key, { key, label, invoices: [] });
    }
    groups.get(key)!.invoices.push(invoice);
  };

  invoices.forEach((invoice) => {
    const d = new Date(invoice.date);
    if (isNaN(d.getTime())) {
      push('sin-fecha', 'Sin fecha', invoice);
      return;
    }
    const year = d.getFullYear();
    const month = d.getMonth();
    const key = `${year}-${String(month + 1).padStart(2, '0')}`;
    push(key, `${MONTH_NAMES[month]} ${year}`, invoice);
  });

  return Array.from(groups.values()).sort((a, b) => {
    if (a.key === 'sin-fecha') return 1;
    if (b.key === 'sin-fecha') return -1;
    return b.key.localeCompare(a.key);
  });
};

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  error,
  onView,
  onEdit,
  onDelete,
}) => {
  if (error) {
    return <Message type="error" message={error} />;
  }

  if (invoices.length === 0) {
    return (
      <Message
        type="neutral"
        message="No hay facturas registradas. Sube un archivo XML para comenzar."
      />
    );
  }

  const groups = groupByMonth(invoices);

  return (
    <div className="bg-card p-6 border border-light rounded-md overflow-x-auto">
      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.key}>
            <h4 className="font-semibold text-primary-color mb-3 flex items-center gap-2">
              {group.label}
              <span className="text-xs font-medium text-text-secondary bg-background-secondary dark:bg-background-dark-secondary border border-border-light rounded-full px-2 py-0.5">
                {group.invoices.length}
              </span>
            </h4>

            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border-light text-text-secondary dark:text-text-dark-secondary">
                  <th className="py-3 px-2">Referencia</th>
                  <th className="py-3 px-2">Emisor</th>
                  <th className="py-3 px-2">Receptor</th>
                  <th className="py-3 px-2">Fecha</th>
                  <th className="py-3 px-2">Vencimiento</th>
                  <th className="py-3 px-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {group.invoices.map((invoice) => (
                  <tr
                    key={invoice.invoiceId}
                    className="border-b border-border-light last:border-0"
                  >
                    <td className="py-3 px-2 font-medium text-primary-color">
                      {invoice.reference || '—'}
                    </td>
                    <td className="py-3 px-2">
                      {invoice.emisorNombre || invoice.emisorRfc || '—'}
                    </td>
                    <td className="py-3 px-2">
                      {invoice.receptorNombre || invoice.receptorRfc || '—'}
                    </td>
                    <td className="py-3 px-2">{formatDate(invoice.date)}</td>
                    <td className="py-3 px-2">
                      {formatDate(invoice.expiration)}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="secondary"
                          className="h-9 min-h-9 px-3 text-xs"
                          onClick={() => onView(invoice.invoiceId)}
                        >
                          Ver
                        </Button>
                        <Button
                          variant="secondary"
                          className="h-9 min-h-9 px-3 text-xs"
                          onClick={() => onEdit(invoice.invoiceId)}
                        >
                          Editar
                        </Button>
                        <button
                          onClick={() => onDelete(invoice.invoiceId)}
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
        ))}
      </div>
    </div>
  );
};

export default InvoiceTable;
