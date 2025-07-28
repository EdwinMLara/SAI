import { Request, Response, NextFunction } from 'express';
import InvoiceValidator from '@validators/Invoice.validator';
import { ZodError } from 'zod';
import responses from '@utils/responses';
import FormatErrors from '@validators/FormatError.utils';
import AppError from '@utils/AppError';

export const validateInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    req.body = await InvoiceValidator.parseAsync(req.body);
    next();
  } catch (error) {
    if (
      error instanceof ZodError ||
      (error as { name?: string })?.name === 'ZodError'
    ) {
      const formattedErrors = FormatErrors(error as ZodError);
      return next(
        new AppError(responses.INTERFACE_VALUE_ERROR, 400, formattedErrors)
      );
    }
    return next(new AppError(responses.INTERNAL_SERVER_ERROR, 500, error));
  }
};
