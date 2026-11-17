import { Document } from 'mongoose';

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
  stampedAt: Date | string | null;
  qrString: string | null;
}

export type SalesNoteStatus = 'draft' | 'stamped';

export interface SalesNoteInterface extends Document {
  reference: string;
  date: Date;
  customer: SalesNoteCustomer;
  products: SalesNoteProduct[];
  subtotal: number;
  iva: number;
  total: number;
  comments?: string | null;
  terms?: string | null;
  fiscalStamp: SalesNoteFiscalStamp;
  status: SalesNoteStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedSalesNotesResponse {
  notes: SalesNoteInterface[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface SalesNoteFiscalUpdate {
  reference: string;
  rfc?: string | null;
  fiscalStamp: {
    satStamp: string;
    issuerStamp: string;
    originalString: string;
    stampedAt: Date | string;
    qrString: string;
  };
}