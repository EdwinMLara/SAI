export interface DetailsProduct {
  brand: string;
  satCode: string;
}

export interface PricesProductInt {
  distribution: number;
  wholesale: number;
  mid_wholesale: number;
  retail: number;
}

export interface ProductInt {
  code: string;
  key: string;
  description: string;
  prices: PricesProductInt;
  details: DetailsProduct;
}
