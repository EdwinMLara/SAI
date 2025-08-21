import { Request, Response, NextFunction } from 'express';

import responses from '@responses';
import AppError from '@utils/system/AppError';

/* ------------------ Code ------------------ */

const RequestMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (
      req.method === 'GET' ||
      req.method === 'DELETE' ||
      (req.method === 'POST' && req.path.endsWith('/logout'))
    ) {
      return next();
    }

    if (
      (req.path.startsWith('/tickets') || req.path.startsWith('/documents')) &&
      req.is('multipart/form-data')
    ) {
      return next();
    }

    const contentType = req.headers['content-type'];
    if (!contentType) {
      throw new AppError(responses.System.badRequest, 400);
    }

    if (req.is('application/json')) {
      const methodsRequiringBody = ['POST', 'PUT', 'PATCH'];
      if (methodsRequiringBody.includes(req.method)) {
        if (!req.body || Object.keys(req.body).length === 0) {
          throw new AppError(responses.System.badRequest, 400);
        }
      }
      return next();
    }

    if (req.is('multipart/form-data')) {
      if (!req.file) {
        throw new AppError(responses.System.missingFieldBody, 400);
      }
      return next();
    }
    throw new AppError(responses.System.missingFieldBody, 415);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default RequestMiddleware;
