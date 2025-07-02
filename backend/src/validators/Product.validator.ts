import { z } from 'zod';

const Prices = z.object({
  distribution: z.number().min(0, 'Distribution price must be non-negative'),
  wholesale: z.number().min(0, 'Wholesale price must be non-negative'),
  mid_wholesale: z.number().min(0, 'Mid wholesale price must be non-negative'),
  retail: z.number().min(0, 'Retail price must be non-negative'),
});

const ProductValidator = z.object({
  key: z.string().min(1, 'Key is required'),
  description: z.string().min(1, 'Description is required'),
  prices: Prices,
});

export type ProductType = z.infer<typeof ProductValidator>;
export default ProductValidator;
