import { Document } from 'mongoose';

interface Destination {
  use_factor: string;
  gain_factor: number;
  pay: number;
}

interface User {
  name: string;
  role: string;
  needs: number;
  use: Destination;
}

interface Prices {
  payment: number;
  iva: number;
  priceWithIva: number;
  distribution: number;
  wholesale: number;
  mid_wholesale: number;
  retail: number;
}

interface Product {
  key: string;
  claveProdServ: string;
  claveUnidad: string;
  description: string;
  quantity: number;
  status: string;
  prices: Prices;
  user_config: User[];
}

interface Payments {
  user: string;
  transaction: string;
  date: Date;
  amount: number;
  status: string;
  voucher: string;
}

export interface InvoiceInterface extends Document {
  invoiceId: string;
  reference: string;
  emisorRfc: string;
  emisorNombre: string;
  receptorRfc: string;
  receptorNombre: string;
  date: Date;
  expiration: Date;
  subtotal: number;
  total: number;
  products: Product[];
  payments: Payments[];
  document: string;
}
/*Interfaz para la paginacion */
export interface PaginatedInvoicesResponse {
  invoices: InvoiceInterface[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

