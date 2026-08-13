import { useState, useCallback } from 'react';

import { InvoiceInterface } from '@interfaces/Invoice.interfaces';
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
  fetchInvoices: () => Promise<void>;
  goToPage: (page: number) => void;
  changeMonth: (month: string) => void;
  deleteById: (invoiceId: string) => Promise<{ status: number; message: string }>;
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
  

  return {
    invoices,
    isLoading,
    error,
    total,
    totalPages,
    page,
    limit: DEFAULT_LIMIT,
    month,
    fetchInvoices,
    goToPage,
    changeMonth,
    deleteById,
  };
};

export default useInvoices;
