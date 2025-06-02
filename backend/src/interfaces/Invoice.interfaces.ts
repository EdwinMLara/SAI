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

export interface InvoiceInterface extends Document {
  invoice: string;
  date: Date;
  products: Product[];
  document: string;
}
