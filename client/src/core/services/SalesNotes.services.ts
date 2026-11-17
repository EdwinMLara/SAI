import axios from '@config/axios.config';

import {
  PaginatedSalesNotesResponse,
  SalesNoteCreateInput,
  SalesNoteFiscalUpdate,
  SalesNoteInterface,
  SalesNoteParsedFiscalStamp,
} from '@interfaces/SalesNote.interfaces';

interface ApiEnvelope {
  status: number;
  message: string;
  all?: unknown;
}

const ensureOk = (data: ApiEnvelope): void => {
  if (data.status >= 400) {
    throw new Error(data.message || 'No se pudo completar la operación');
  }
};

interface GetAllSalesNotesParams {
  page?: number;
  limit?: number;
}

export async function getAllSalesNotes(
  params: GetAllSalesNotesParams = {}
): Promise<{ status: number; message: string } & PaginatedSalesNotesResponse> {
  const response = await axios.get('/sales-notes/list', { params });
  const data = response.data as ApiEnvelope;
  ensureOk(data);
  const all = data.all as Partial<PaginatedSalesNotesResponse> | undefined;

  return {
    status: data.status,
    message: data.message,
    notes: all?.notes ?? [],
    total: all?.total ?? 0,
    totalPages: all?.totalPages ?? 0,
    page: all?.page ?? 1,
    limit: all?.limit ?? 10,
  };
}

export async function getSalesNote(
  reference: string
): Promise<{ status: number; message: string; note: SalesNoteInterface }> {
  const response = await axios.get('/sales-notes', {
    params: { reference },
  });
  const data = response.data as ApiEnvelope;
  ensureOk(data);
  const all = data.all as { note?: SalesNoteInterface } | undefined;

  if (!all?.note) {
    throw new Error(data.message || 'No se pudo cargar la nota de venta');
  }

  return {
    status: data.status,
    message: data.message,
    note: all.note,
  };
}

export async function createSalesNote(
  note: SalesNoteCreateInput
): Promise<{ status: number; message: string; note: SalesNoteInterface }> {
  const response = await axios.post('/sales-notes', note);
  const data = response.data as ApiEnvelope;
  ensureOk(data);
  const all = data.all as { note?: SalesNoteInterface } | undefined;

  if (!all?.note) {
    throw new Error(data.message || 'No se pudo crear la nota de venta');
  }

  return {
    status: data.status,
    message: data.message,
    note: all.note,
  };
}

export async function updateFiscalStamp(
  dataUpdate: SalesNoteFiscalUpdate
): Promise<{ status: number; message: string; note: SalesNoteInterface }> {
  const response = await axios.patch('/sales-notes/fiscal', dataUpdate);
  const data = response.data as ApiEnvelope;
  ensureOk(data);
  const all = data.all as { note?: SalesNoteInterface } | undefined;

  if (!all?.note) {
    throw new Error(data.message || 'No se pudo guardar el sello fiscal');
  }

  return {
    status: data.status,
    message: data.message,
    note: all.note,
  };
}

export async function parseFiscalStampXml(file: File): Promise<{
  status: number;
  message: string;
  fiscalStamp: SalesNoteParsedFiscalStamp;
}> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post('/sales-notes/fiscal/xml/parse', formData);
  const data = response.data as ApiEnvelope;
  ensureOk(data);
  const all = data.all as
    | { fiscalStamp?: SalesNoteParsedFiscalStamp }
    | undefined;

  if (!all?.fiscalStamp) {
    throw new Error(data.message || 'No se pudo leer el XML timbrado');
  }

  return {
    status: data.status,
    message: data.message,
    fiscalStamp: all.fiscalStamp,
  };
}

export async function uploadFiscalStampXml(
  reference: string,
  file: File
): Promise<{ status: number; message: string; note: SalesNoteInterface }> {
  const formData = new FormData();
  formData.append('reference', reference);
  formData.append('file', file);

  const response = await axios.post('/sales-notes/fiscal/xml', formData);
  const data = response.data as ApiEnvelope;
  ensureOk(data);
  const all = data.all as { note?: SalesNoteInterface } | undefined;

  if (!all?.note) {
    throw new Error(data.message || 'No se pudo leer el XML timbrado');
  }

  return {
    status: data.status,
    message: data.message,
    note: all.note,
  };
}

export async function deleteSalesNote(
  reference: string
): Promise<{ status: number; message: string }> {
  const response = await axios.delete('/sales-notes', {
    params: { reference },
  });
  const data = response.data as ApiEnvelope;
  ensureOk(data);

  return { status: data.status, message: data.message };
}
