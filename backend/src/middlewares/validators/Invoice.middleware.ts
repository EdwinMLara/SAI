import { Request, Response, NextFunction } from 'express';
import InvoiceValidator, {
  formatValidationErrors,
} from '@validators/Invoice.validator';
import logger from '@utils/logger';
import { ZodError } from 'zod';
import responses from '@utils/responses';

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
      const formattedErrors = formatValidationErrors(error as ZodError);

      logger.error('Invoice validation failed', {
        errors: formattedErrors,
        requestId: req.headers['x-request-id'] || 'unknown',
      });

      res.status(400).json({
        message: responses.INTERFACE_VALUE_ERROR,
        errors: formattedErrors,
      });
      return;
    }

    logger.error('Unexpected validation error', {
      error: responses.INTERNAL_SERVER_ERROR,
      requestId: req.headers['x-request-id'] || 'unknown',
    });

    res.status(500).json({
      message: responses.INTERFACE_VALUE_ERROR,
    });
    return;
  }
};
