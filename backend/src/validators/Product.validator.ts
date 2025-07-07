import { z } from 'zod';
import responses from '@utils/responses';

const Prices = z.object({
  distribution: z.number().min(0, responses.VAL_ONLY_POSITIVE),
  wholesale: z.number().min(0, responses.VAL_ONLY_POSITIVE),
  mid_wholesale: z.number().min(0, responses.VAL_ONLY_POSITIVE),
  retail: z.number().min(0, responses.VAL_ONLY_POSITIVE),
});

const ProductValidator = z.object({
  key: z.string().min(1, responses.VAL_REQUIRED),
  description: z.string().min(1, responses.VAL_REQUIRED),
  prices: Prices,
});

export type ProductType = z.infer<typeof ProductValidator>;
export default ProductValidator;
