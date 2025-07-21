import { Request, Response, NextFunction } from 'express';
import InvoiceValidator from '@validators/Invoice.validator';
import { ZodError } from 'zod';
import responses from '@utils/responses';
import FormatErrors from '@validators/FormatError.utils';

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

      res.status(400).json({
        message: responses.INTERFACE_VALUE_ERROR,
        errors: formattedErrors,
      });
      return;
    }

    res.status(500).json({
      message: responses.INTERFACE_VALUE_ERROR,
    });
    return;
  }
};
