import { NextFunction, Request, Response } from 'express';

import log from '@utils/system/Logger.utils';
import AppError from '@utils/system/AppError';

/* ------------------ Code ------------------ */

const ErrorMiddleware = (
   err: AppError,
   req: Request,
   res: Response,
   next: NextFunction
): void => {
   const statusCode = err instanceof AppError ? err.statusCode || 500 : 500;

   log({
      level: 'error',
      message: err.message,
      metadata: {
         user: req.user?.name || 'Undefined',
         clientIp: req.ip as string,
         stackTrace: err.stack as string,
         endpoint: req.path,
         method: req.method,
         statusCode: statusCode,
      },
   });

   if (err instanceof AppError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
   }

   res.status(500).json({
      message: 'Internal server error',
   });

   return;
};

export default ErrorMiddleware;
