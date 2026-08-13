import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { Loading, Button } from '@ui/index.ui';
import { H1 } from '@components/semantic';

import { useInvoices, InvoiceTable } from '../';

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

interface MonthOption {
  value: string;
  label: string;
}

const buildMonthOptions = (): MonthOption[] => {
  const options: MonthOption[] = [];
  const now = new Date();

  for (let i = 0; i < 12; i += 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    options.push({
      value,
      label: `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`,
    });
  }

  return options;
};

const InvoicesList = () => {
  const navigate = useNavigate();
  const {
    invoices,
    isLoading,
    error,
    total,
    totalPages,
    page,
    limit,
    month,
    fetchInvoices,
    goToPage,
    changeMonth,
    deleteById,
  } = useInvoices();

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleDelete = async (invoiceId: string) => {
    const confirmed = window.confirm(
      '¿Seguro que deseas eliminar esta factura?'
    );
    if (!confirmed) return;
    try {
      await deleteById(invoiceId);
    } catch (error) {
      console.error('Error al eliminar la factura:', error);
    }
  };

  const monthOptions = buildMonthOptions();
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <H1>Facturas 1</H1>
        <Link
          to="/invoices/upload"
          className="text-brand font-semibold hover:underline text-sm"
        >
          Subir factura +
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="month-select" className="text-sm text-text-secondary">
          Mes:
        </label>
        <select
          id="month-select"
          value={month}
          onChange={(e) => changeMonth(e.target.value)}
          className="px-3 py-2 rounded-md border border-border-light bg-background-secondary dark:bg-background-dark-secondary text-text-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-brand/40"
        >
          <option value="">Todos los meses</option>
          {monthOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <Loading message="Cargando facturas..." />
      ) : (
        <>
          <InvoiceTable
            invoices={invoices}
            error={error}
            onView={(id) => navigate(`/invoices/${id}`)}
            onEdit={(id) => navigate(`/invoices/${id}`)}
            onDelete={handleDelete}
          />

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-4 border border-light rounded-md">
              <span className="text-sm text-text-secondary">
                Mostrando {start}–{end} de {total} facturas
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

export default InvoicesList;
