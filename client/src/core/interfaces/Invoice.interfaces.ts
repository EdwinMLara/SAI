export interface Destination {
  use_factor: string;
  gain_factor: number;
  pay: number;
}

export interface InvoiceUserConfig {
  name: string;
  role: string;
  needs: number;
  use: Destination;
}

export interface InvoicePrices {
  payment: number;
  iva: number;
  priceWithIva: number;
  distribution: number;
  wholesale: number;
  mid_wholesale: number;
  retail: number;
}

export interface InvoiceProduct {
  key: string;
  claveProdServ: string;
  claveUnidad: string;
  description: string;
  quantity: number;
  status: string;
  prices: InvoicePrices;
  user_config: InvoiceUserConfig[];
}

export interface InvoicePayment {
  user: string;
  transaction: string;
  date: Date;
  amount: number;
  status: string;
  voucher: string;
}

export interface InvoiceInterface {
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
  products: InvoiceProduct[];
  payments: InvoicePayment[];
  document: string | null;
}

export interface PaginatedInvoicesResponse {
  invoices: InvoiceInterface[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}
