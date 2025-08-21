import { PricesProductInt } from './Product.interfaces';

interface DestinationInvoiceInt {
  pay: number;
  gain: number;
  use: string;
}

interface UserInvoiceInt {
  userId: unknown;
  needs: number;
  use: DestinationInvoiceInt;
}

interface PricesInt extends PricesProductInt {
  payment: number;
}

interface ProductInvoiceInt {
  productkey: string;
  description: string;
  quantityReception: number;
  statusReception: string;
  prices: PricesProductInt;
  userConfig: UserInvoiceInt[];
}

interface PaymentsInvoiceInt {
  userId: unknown;
  transactionId: string;
  transactionDate: Date;
  amount: number;
  status: string;
  voucherURL: string;
}

export interface InvoiceInt {
  invoiceId: string;
  documentId: string;
  initDate: Date;
  expiration: Date;
  products: ProductInvoiceInt[];
  payments: PaymentsInvoiceInt[];
  documentURL: string;
}
