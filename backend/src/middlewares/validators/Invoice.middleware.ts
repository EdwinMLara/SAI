import { Request, Response, NextFunction } from 'express';
import InvoiceValidator, {
  formatValidationErrors,
} from '../../../../shared/dist/validators/Invoice.validator';
import logger from '@utils/logger';
import { ZodError } from 'zod';

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
        message: 'Invoice validation failed',
        details:
          'Please review the submitted data. Some fields do not meet the requirements.',
        errors: formattedErrors,
      });
      return;
    }

    logger.error('Unexpected validation error', {
      error: error instanceof Error ? error.message : String(error),
      requestId: req.headers['x-request-id'] || 'unknown',
    });

    res.status(500).json({
      message: 'Internal server error during validation',
      details: 'An unexpected error occurred. Please try again later.',
    });
    return;
  }
};
