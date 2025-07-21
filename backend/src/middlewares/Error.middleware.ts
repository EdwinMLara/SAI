import { Request, Response, NextFunction } from 'express';
import AppError from '@utils/AppError';

const ErrorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({ message: 'Error interno del servidor' });
};

export default ErrorMiddleware;
