export interface Prices {
  distribution: number;
  wholesale: number;
  mid_wholesale: number;
  retail: number;
}

export interface ProductInterface {
  key: string;
  description: string;
  prices: Prices;
}
