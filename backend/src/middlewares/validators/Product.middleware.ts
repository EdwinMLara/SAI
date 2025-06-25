import { Request, Response, NextFunction } from 'express';
import logger from '@utils/logger';

// Implementación local temporal de ProductValidator
const ProductValidator = {
  async parseAsync(data: any) {
    // Aquí deberías agregar la lógica de validación real
    return data;
  },
};

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
