import { z } from 'zod';

const UserValidator = z.object({
  image: z.string().optional(),
  name: z.string(),
  userName: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.string(),
});

export type UserType = z.infer<typeof UserValidator>;
export default UserValidator;
