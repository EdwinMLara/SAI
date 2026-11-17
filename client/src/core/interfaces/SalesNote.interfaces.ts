export interface SalesNoteCustomer {
  name: string;
  rfc?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export type SalesNoteProductType = 'resale' | 'new' | 'service';

export interface SalesNoteProduct {
  type: SalesNoteProductType;
  description: string;
  quantity: number;
  purchasePrice: number;
  unitPrice: number;
  subtotal: number;
  iva: number;
  total: number;
}

export interface SalesNoteFiscalStamp {
  satStamp: string | null;
  issuerStamp: string | null;
  originalString: string | null;
  stampedAt: string | null;
  qrString: string | null;
}

export interface SalesNoteParsedFiscalStamp {
  uuid: string;
  rfc: string | null;
  satStamp: string;
  issuerStamp: string;
  originalString: string;
  stampedAt: string;
  qrString: string;
}

export type SalesNoteStatus = 'draft' | 'stamped';

export interface SalesNoteInterface {
  reference: string;
  date: string;
  customer: SalesNoteCustomer;
  products: SalesNoteProduct[];
  subtotal: number;
  iva: number;
  total: number;
  comments?: string | null;
  terms?: string | null;
  fiscalStamp: SalesNoteFiscalStamp;
  status: SalesNoteStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface SalesNoteFiscalStampInput {
  satStamp: string;
  issuerStamp: string;
  originalString: string;
  stampedAt: string;
  qrString: string;
}

export interface SalesNoteCreateInput {
  reference: string;
  date: string;
  customer: SalesNoteCustomer;
  products: SalesNoteProduct[];
  comments?: string | null;
  terms?: string | null;
  fiscalStamp?: SalesNoteFiscalStampInput;
}

export interface SalesNoteFiscalUpdate {
  reference: string;
  rfc?: string | null;
  fiscalStamp: SalesNoteFiscalStampInput;
}

export interface PaginatedSalesNotesResponse {
  notes: SalesNoteInterface[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}
