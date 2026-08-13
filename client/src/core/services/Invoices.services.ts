import axios from '@config/axios.config';

import {
  InvoiceInterface,
  PaginatedInvoicesResponse,
} from '@interfaces/Invoice.interfaces';

/* ------------------ Code ------------------ */

interface GetAllInvoicesParams {
  page?: number;
  limit?: number;
  month?: string;
}

export async function getAllInvoices(
  params: GetAllInvoicesParams = {}
): Promise<{ status: number; message: string } & PaginatedInvoicesResponse> {
  const response = await axios.get('/invoices/list', { params });
  const all = response.data.all;
  return {
    status: response.status,
    message: response.data.message,
    invoices: all?.invoices ?? [],
    total: all?.total ?? 0,
    totalPages: all?.totalPages ?? 0,
    page: all?.page ?? 1,
    limit: all?.limit ?? 5,
  };
}

export async function uploadXML(file: File
): Promise<{ status: number; message: string; invoice: InvoiceInterface }> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post('/invoices/upload', formData);
  if (response.data.status >= 400) {
    throw new Error(
      response.data.message || 'No se pudo procesar el archivo XML'
    );
  }
  return {
    status: response.data.status,
    message: response.data.message,
    invoice: response.data.all?.invoice,
  };
}

export async function getInvoice(
  invoiceId: string
): Promise<{ status: number; message: string; invoice: InvoiceInterface }> {
  const response = await axios.get('/invoices', { params: { id: invoiceId } });
  return {
    status: response.status,
    message: response.data.message,
    invoice: response.data.all?.invoice,
  };
}

export async function updateInvoice(
  invoice: InvoiceInterface
): Promise<{ status: number; message: string }> {
  const response = await axios.put('/invoices', invoice);
  return { status: response.status, message: response.data.message };
}

export async function deleteInvoice(
  invoiceId: string
): Promise<{ status: number; message: string }> {
  const response = await axios.delete('/invoices', {
    params: { id: invoiceId },
  });
  return { status: response.status, message: response.data.message };
}
