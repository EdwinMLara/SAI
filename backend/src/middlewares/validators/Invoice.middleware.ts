import { Request, Response, NextFunction } from 'express';
import InvoiceValidator from '../../../../shared/validators/Invoice.validator';
import logger from '../../utils/logger';

export const validateInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    req.body = await InvoiceValidator.parseAsync(req.body);
    next();
  } catch (error) {
    logger.error('Invoice validation error:', error);
    res.status(400).json({
      status: 400,
      message: 'Bad Request. Invalid invoice data.',
    });
  }
};
