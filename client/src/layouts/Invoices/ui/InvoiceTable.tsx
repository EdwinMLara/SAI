import React from 'react';

import { Button, Message } from '@ui/index.ui';
import { InvoiceInterface, MonthTotals } from '@interfaces/Invoice.interfaces';

interface InvoiceTableProps {
  invoices: InvoiceInterface[];
  monthTotals: MonthTotals[];
  error: string;
  exportingMonth?: string | null;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onExport: (
    monthKey: string,
    monthLabel: string,
    invoices: InvoiceInterface[]
  ) => void;
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

const formatCurrency = (value: number) =>
  `$${(Number(value) || 0).toFixed(2)}`;

const getInvoiceIva = (invoice: InvoiceInterface) =>
  (invoice.products || []).reduce(
    (acc, product) => acc + (Number(product.prices?.iva) || 0),
    0
  );

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
  monthTotals,
  error,
  exportingMonth = null,
  onView,
  onEdit,
  onDelete,
  onExport,
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
  const totalsByMonth = new Map<string, MonthTotals>(
    (monthTotals || []).map((total) => [total.month, total])
  );

  return (
    <div className="bg-card p-6 border border-light rounded-md overflow-x-auto">
      <div className="space-y-8">
        {groups.map((group) => {
          const groupTotals =
            totalsByMonth.get(group.key) ??
            group.invoices.reduce(
              (acc, invoice) => {
                acc.subtotal += Number(invoice.subtotal) || 0;
                acc.iva += getInvoiceIva(invoice);
                acc.total += Number(invoice.total) || 0;
                acc.count += 1;
                return acc;
              },
              { month: group.key, subtotal: 0, iva: 0, total: 0, count: 0 }
            );

          return (
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
                  <th className="py-3 px-2 text-right">Total sin IVA</th>
                  <th className="py-3 px-2 text-right">IVA</th>
                  <th className="py-3 px-2 text-right">Total con IVA</th>
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
                    <td className="py-3 px-2 text-right tabular-nums">
                      {formatCurrency(invoice.subtotal)}
                    </td>
                    <td className="py-3 px-2 text-right tabular-nums">
                      {formatCurrency(getInvoiceIva(invoice))}
                    </td>
                    <td className="py-3 px-2 text-right tabular-nums font-medium text-primary-color">
                      {formatCurrency(invoice.total)}
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
              <tfoot>
                <tr className="border-t-2 border-border-light font-semibold text-primary-color">
                  <td className="py-3 px-2" colSpan={5}>
                    Total {group.label}
                  </td>
                  <td className="py-3 px-2 text-right tabular-nums">
                    {formatCurrency(groupTotals.subtotal)}
                  </td>
                  <td className="py-3 px-2 text-right tabular-nums">
                    {formatCurrency(groupTotals.iva)}
                  </td>
                  <td className="py-3 px-2 text-right tabular-nums">
                    {formatCurrency(groupTotals.total)}
                  </td>
                  <td className="py-3 px-2" />
                </tr>
              </tfoot>
            </table>

            <div className="flex justify-end mt-3">
              <Button
                variant="secondary"
                className="h-9 min-h-9 px-3 text-xs"
                disabled={exportingMonth === group.key}
                onClick={() =>
                  onExport(group.key, group.label, group.invoices)
                }
              >
                {exportingMonth === group.key
                  ? 'Generando Excel...'
                  : 'Descargar facturas del mes'}
              </Button>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default InvoiceTable;
