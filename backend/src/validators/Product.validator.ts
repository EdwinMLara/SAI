import { z } from 'zod';

const Prices = z.object({
  distribution: z.number().positive(),
  wholesale: z.number().positive(),
  mid_wholesale: z.number().positive(),
  retail: z.number().positive(),
});

const ProductValidator = z.object({
  key: z.string(),
  description: z.string(),
  prices: Prices,
});

export type ProductType = z.infer<typeof ProductValidator>;
export default ProductValidator;
