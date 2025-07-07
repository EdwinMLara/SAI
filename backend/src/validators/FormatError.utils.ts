import { z } from 'zod';

function FormatErrors(error: z.ZodError): { path: string; message: string }[] {
  return error.errors.map((err) => ({
    path: err.path.join('.'),
    message: err.message,
  }));
}

export default FormatErrors;
