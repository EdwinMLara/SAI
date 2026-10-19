import { useState, useCallback } from 'react';

import { InvoiceInterface, MonthTotals } from '@interfaces/Invoice.interfaces';
import * as services from '@services/Invoices.services';

interface UseInvoicesReturn {
  invoices: InvoiceInterface[];
  isLoading: boolean;
  error: string;
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  month: string;
  monthTotals: MonthTotals[];
  exportingMonth: string | null;
  exportError: string;
  fetchInvoices: () => Promise<void>;
  goToPage: (page: number) => void;
  changeMonth: (month: string) => void;
  deleteById: (invoiceId: string) => Promise<{ status: number; message: string }>;
  exportMonth: (
    monthKey: string,
    monthLabel: string,
    fallbackInvoices: InvoiceInterface[]
  ) => Promise<void>;
}

const DEFAULT_LIMIT = 5;

const useInvoices = (): UseInvoicesReturn => {
  const [invoices, setInvoices] = useState<InvoiceInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [month, setMonth] = useState<string>('');
  const [monthTotals, setMonthTotals] = useState<MonthTotals[]>([]);
  const [exportingMonth, setExportingMonth] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string>('');

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await services.getAllInvoices({
        page,
        limit: DEFAULT_LIMIT,
        month: month || undefined,
      });

      setTotal(response.total);
      setTotalPages(response.totalPages);
      setMonthTotals(response.monthTotals ?? []);

      if (response.invoices.length === 0 && response.page > 1) {
        setPage(response.page - 1);
        return;
      }

      setInvoices(response.invoices);
      setPage(response.page);
    } catch (err) {
      setError('No se pudieron cargar las facturas');
    } finally {
      setIsLoading(false);
    }
  }, [page, month]);

  const goToPage = (nextPage: number) => {
    if (nextPage < 1) return;
    if (totalPages > 0 && nextPage > totalPages) return;
    setPage(nextPage);
  };

  const changeMonth = (nextMonth: string) => {
    setMonth(nextMonth);
    setPage(1);
  };

  const deleteById = async (invoiceId: string) => {
    const response = await services.deleteInvoice(invoiceId);
    await fetchInvoices();
    return response;
  };

  const exportMonth = async (
    monthKey: string,
    monthLabel: string,
    fallbackInvoices: InvoiceInterface[]
  ) => {
    setExportingMonth(monthKey);
    setExportError('');
    try {
      const isMonthKey = /^\d{4}-\d{2}$/.test(monthKey);
      const invoicesToExport = isMonthKey
        ? (await services.getInvoicesByMonth(monthKey)).invoices
        : fallbackInvoices;

      const { exportInvoicesToExcel } = await import(
        '../utils/exportInvoicesToExcel'
      );
      exportInvoicesToExcel(invoicesToExport, monthLabel, monthKey);
    } catch (err) {
      setExportError('No se pudieron exportar las facturas del mes');
    } finally {
      setExportingMonth(null);
    }
  };

  return {
    invoices,
    isLoading,
    error,
    total,
    totalPages,
    page,
    limit: DEFAULT_LIMIT,
    month,
    monthTotals,
    exportingMonth,
    exportError,
    fetchInvoices,
    goToPage,
    changeMonth,
    deleteById,
    exportMonth,
  };
};

export default useInvoices;
