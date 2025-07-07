import { z } from 'zod';
import responses from '@utils/responses';

const UserValidator = z.object({
  image: z.string().optional(),
  name: z
    .string()
    .min(4, responses.VAL_MIN_LENGTH.replace('{min}', '4'))
    .max(50, responses.VAL_MAX_LENGTH.replace('{max}', '50')),
  userName: z
    .string()
    .min(4, responses.VAL_USERNAME_LENGTH)
    .max(20, responses.VAL_USERNAME_LENGTH)
    .regex(/^[a-zA-Z0-9_]+$/, responses.VAL_ONLY_LETTERS),
  phone: z.string().regex(/^\d{10}$/, responses.VAL_INVALID_PHONE),
  email: z.string().email(responses.VAL_INVALID_EMAIL),
  password: z.string().min(6, responses.VAL_INVALID_PASSWORD),
  role: z.enum(['user', 'admin']),
});

export type UserType = z.infer<typeof UserValidator>;
export default UserValidator;
