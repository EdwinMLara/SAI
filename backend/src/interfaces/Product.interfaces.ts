import { Document } from 'mongoose';

export interface Prices {
  distribution: number;
  wholesale: number;
  mid_wholesale: number;
  retail: number;
}

export interface ProductInterface extends Document {
  key: string;
  clave: string;
  description: string;
  prices: Prices;
}
