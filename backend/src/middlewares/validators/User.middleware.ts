import { Request, Response, NextFunction } from 'express';
import UserValidator from '@validators/User.validator';
import responses from '@utils/responses';
import logger from '@utils/logger';
import { ZodError } from 'zod';

export const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    req.body = await UserValidator.parseAsync(req.body);
    next();
  } catch (error) {
    if (
      error instanceof ZodError ||
      (error as { name?: string })?.name === 'ZodError'
    ) {
      logger.error('User validation failed', {
        errors: error instanceof ZodError ? error.errors : error,
        requestId: req.headers['x-request-id'] || 'unknown',
      });
      res.status(400).json({
        message: responses.INTERFACE_VALUE_ERROR,
        errors: error instanceof ZodError ? error.errors : error,
      });
      return;
    }
    logger.error('Unexpected user validation error', {
      error: responses.INTERNAL_SERVER_ERROR,
      requestId: req.headers['x-request-id'] || 'unknown',
    });
    res.status(500).json({
      message: responses.INTERNAL_SERVER_ERROR,
    });
    return;
  }
};
