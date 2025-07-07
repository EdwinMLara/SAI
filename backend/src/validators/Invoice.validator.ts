import { z } from 'zod';
import { stringToDate, dateToString } from '@utils/dateTransform';
import responses from '@utils/responses';

const VALID_ROLES = ['admin', 'user'] as const;
const VALID_STATUS = [
  'recibido',
  'backorder',
  'cancelado',
  'devolución',
] as const;
const VALID_PAYMENT_STATUS = [
  'paid',
  'pending',
  'rejected',
  'partial',
] as const;

const Destination = z.object({
  use_factor: z.string().default('general'),
  gain_factor: z.number().positive().default(1),
  pay: z.number().positive().default(0),
});

const User = z.object({
  name: z
    .string()
    .min(2, responses.VAL_MIN_LENGTH.replace('{min}', '2'))
    .default('default_user'),
  role: z.enum(VALID_ROLES).default('user'),
  needs: z.number().positive().default(1),
  use: Destination.default({}),
});

const Prices = z.object({
  payment: z.number().positive().default(0),
  distribution: z.number().positive().default(0),
  wholesale: z.number().positive().default(0),
  mid_wholesale: z.number().positive().default(0),
  retail: z.number().positive().default(0),
});

const Product = z.object({
  key: z
    .string()
    .regex(/^\d{1,10}$/, responses.VAL_ONLY_NUMBERS)
    .min(1, responses.VAL_MIN_LENGTH.replace('{min}', '1'))
    .max(10, responses.VAL_MAX_LENGTH.replace('{max}', '10')),
  description: z
    .string()
    .min(3, responses.VAL_MIN_LENGTH.replace('{min}', '3'))
    .default(''),
  quantity: z.number().positive().int().default(1),
  status: z.enum(VALID_STATUS).default('recibido'),
  prices: Prices.default({}),
  user_config: z.array(User).optional().default([]),
});

const Payments = z.object({
  user: z.string().min(2, responses.VAL_MIN_LENGTH.replace('{min}', '2')),
  transaction: z
    .string()
    .min(3, responses.VAL_MIN_LENGTH.replace('{min}', '3')),
  date: z.string().transform(stringToDate),
  amount: z.number().positive(),
  status: z.enum(VALID_PAYMENT_STATUS),
  voucher: z.string().nullable().default(null),
});

const InvoiceValidator = z
  .object({
    id: z
      .string()
      .min(3, responses.VAL_MIN_LENGTH.replace('{min}', '3'))
      .max(50, responses.VAL_MAX_LENGTH.replace('{max}', '50')),
    reference: z
      .string()
      .min(3, responses.VAL_MIN_LENGTH.replace('{min}', '3')),
    date: z
      .string()
      .transform(stringToDate)
      .default(() => dateToString(new Date())),
    expiration: z
      .string()
      .transform(stringToDate)
      .default(() => {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        return dateToString(date);
      }),
    products: z.array(Product).min(1, responses.VAL_REQUIRED),
    payments: z.array(Payments).optional().default([]),
    document: z.string().default(''),
  })
  .refine(
    (data) => {
      if (data.date && data.expiration) {
        return data.expiration > data.date;
      }
      return true;
    },
    {
      message: responses.EXPIRATION_DATE_ERROR,
      path: ['expiration'],
    }
  );

export type InvoiceType = z.infer<typeof InvoiceValidator>;
export default InvoiceValidator;
