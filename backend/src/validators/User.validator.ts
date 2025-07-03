import { z } from 'zod';

const UserValidator = z.object({
  image: z.string().optional(),
  name: z.string().min(1, 'El nombre es obligatorio'),
  userName: z.string().min(1, 'El nombre de usuario es obligatorio'),
  email: z.string().email('Formato de correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['admin', 'user'], {
    errorMap: () => ({ message: 'El rol debe ser admin o user' }),
  }),
});

export type UserType = z.infer<typeof UserValidator>;
export default UserValidator;
