import { z } from 'zod';

import { stringToDate } from '../utils/dateTransform';

const Destination = z.object({
  use_factor: z.string(),
  gain_factor: z.number().positive(),
  pay: z.number().positive(),
});

const User = z.object({
  name: z.string(),
  role: z.string(),
  needs: z.number().positive(),
  use: Destination,
});

const Prices = z.object({
  payment: z.number().positive(),
  distribution: z.number().positive(),
  wholesale: z.number().positive(),
  mid_wholesale: z.number().positive(),
  retail: z.number().positive(),
});

const Product = z.object({
  key: z.string(),
  description: z.string(),
  quantity: z.number().positive(),
  status: z.string(),
  prices: Prices,
  user_config: z.array(User),
});

const Payments = z.object({
  user: z.string(),
  transaction: z.string(),
  date: z.string().transform(stringToDate),
  amount: z.number().positive(),
  status: z.string(),
  voucher: z.string().nullable().default(null),
});

const InvoiceValidator = z.object({
  invoice: z.string(),
  date: z.string().transform(stringToDate),
  expiration: z.string().transform(stringToDate),
  products: z.array(Product),
  payments: z.array(Payments),
  document: z.string().optional(),
});

export type InvoiceType = z.infer<typeof InvoiceValidator>;
export default InvoiceValidator;
