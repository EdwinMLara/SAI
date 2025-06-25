import { Request, Response, NextFunction } from 'express';
import ProductValidator from '@validators/Product.validator';
import logger from '@utils/logger';
import { ZodError } from 'zod';

export const validateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    req.body = await ProductValidator.parseAsync(req.body);
    next();
  } catch (error) {
    if (
      error instanceof ZodError ||
      (error as { name?: string })?.name === 'ZodError'
    ) {
      logger.error('Product validation failed', {
        errors: error instanceof ZodError ? error.errors : error,
        requestId: req.headers['x-request-id'] || 'unknown',
      });
      res.status(400).json({
        message: 'Product validation failed',
        details:
          'Please review the submitted data. Some fields do not meet the requirements.',
        errors: error instanceof ZodError ? error.errors : error,
      });
      return;
    }
    logger.error('Unexpected product validation error', {
      error: error instanceof Error ? error.message : String(error),
      requestId: req.headers['x-request-id'] || 'unknown',
    });
    res.status(500).json({
      message: 'Internal server error during product validation',
      details: 'An unexpected error occurred. Please try again later.',
    });
    return;
  }
};
