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
  distribution: number;
  wholesale: number;
  mid_wholesale: number;
  retail: number;
}

interface Product {
  key: string;
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
  date: Date;
  expiration: Date;
  products: Product[];
  payments: Payments[];
  document: string;
}
