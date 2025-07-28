import { Request, Response } from 'express';
import AppError from '../utils/AppError';
import log from '@utils/Logger.utils';

const ErrorMiddleware = (err: Error, req: Request, res: Response) => {
  const returnCode = err instanceof AppError ? err.statusCode || 500 : 500;

  log({
    level: 'error',
    message: err.message,
    metadata: {
      user: req.user.name || 'Undefined',
      clientIp: req.ip as string,
      stackTrace: err.stack as string,
      endpoint: req.path,
      method: req.method,
      statusCode: returnCode,
    },
  });

  if (err instanceof AppError) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
    return;
  }
  res.status(500).json({
    message: 'Error interno del servidor',
  });
};

export default ErrorMiddleware;
