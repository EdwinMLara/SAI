import { Request, Response, NextFunction } from 'express';

import responses from '../utils/responses';
import AppError from '@utils/AppError';

/* ------------------ Code ------------------ */

const RequestMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (req.method === 'GET' || req.method === 'DELETE') {
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
      throw new AppError(responses.BAD_REQUEST, 400);
    }

    if (req.is('application/json')) {
      const methodsRequiringBody = ['POST', 'PUT', 'PATCH'];
      if (methodsRequiringBody.includes(req.method)) {
        if (!req.body || Object.keys(req.body).length === 0) {
          throw new AppError(responses.BAD_REQUEST, 400);
        }
      }
      return next();
    }

    if (req.is('multipart/form-data')) {
      if (!req.file) {
        throw new AppError(responses.REQUIRED_FILE, 400);
      }
      return next();
    }
    throw new AppError(responses.INVALID_FILETYPE, 415);
  } catch (error) {
    next(error);
  }
};

export default RequestMiddleware;
