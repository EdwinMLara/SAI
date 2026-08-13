import { useState, useEffect } from 'react';

import { InvoiceInterface } from '@interfaces/Invoice.interfaces';
import * as services from '@services/Invoices.services';

interface UseInvoiceDetailReturn {
  invoice: InvoiceInterface | null;
  setInvoice: (invoice: InvoiceInterface) => void;
  isLoading: boolean;
  error: string;
  isSaving: boolean;
  isDeleting: boolean;
  save: (data: InvoiceInterface) => Promise<{ status: number; message: string }>;
  remove: () => Promise<{ status: number; message: string }>;
}

const useInvoiceDetail = (invoiceId: string): UseInvoiceDetailReturn => {
  const [invoice, setInvoice] = useState<InvoiceInterface | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchInvoice = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await services.getInvoice(invoiceId);
      setInvoice(response.invoice);
    } catch (err) {
      setError('No se pudo cargar la factura');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  const save = async (data: InvoiceInterface) => {
    setIsSaving(true);
    try {
      const response = await services.updateInvoice(data);
      setInvoice(data);
      return response;
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async () => {
    setIsDeleting(true);
    try {
      const response = await services.deleteInvoice(invoiceId);
      return response;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    invoice,
    setInvoice,
    isLoading,
    error,
    isSaving,
    isDeleting,
    save,
    remove,
  };
};

export default useInvoiceDetail;
