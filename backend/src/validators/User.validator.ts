import { z } from 'zod';

const UserValidator = z.object({
  image: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  userName: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'user'], {
    errorMap: () => ({ message: 'Role must be either admin or user' }),
  }),
});

export type UserType = z.infer<typeof UserValidator>;
export default UserValidator;
