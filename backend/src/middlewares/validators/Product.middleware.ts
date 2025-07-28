import { Request, Response, NextFunction } from 'express';
import ProductValidator from '@validators/Product.validator';
import responses from '@utils/responses';
import { ZodError } from 'zod';
import AppError from '@utils/AppError';

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
      return next(new AppError(responses.INTERFACE_VALUE_ERROR, 400, error));
    }
    return next(new AppError(responses.INTERNAL_SERVER_ERROR, 500, error));
  }
};
