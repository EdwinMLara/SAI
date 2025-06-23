import { Request, Response, NextFunction } from 'express';
import ProductValidator from '../../../../shared/validators/Product.validator';
import logger from '../../utils/logger';

export const validateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    req.body = await ProductValidator.parseAsync(req.body);
    next();
  } catch (error) {
    logger.error('Product validation error:', error);
    res.statusMessage = 'Some fields at Product are invalid.';
    res.status(400).json();
  }
};
