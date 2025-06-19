import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const RequestMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.debug(`[Request] Received '${req.method}' request at '${req.url}'`);

  if (req.method === 'GET' || req.method === 'DELETE') {
    return next();
  }

  if (
    req.path.includes('/invoice/document/') &&
    req.is('multipart/form-data')
  ) {
    return next();
  }

  const contentType = req.headers['content-type'];
  if (!contentType) {
    logger.error(`[Request] Missing Content-Type header.`);
    res.status(400).json({
      status: 400,
      message: 'Bad Request. Missing Content-Type header.',
    });
  }

  if (req.is('application/json')) {
    logger.debug(`[Request] Content-Type: ${contentType}`);

    const methodsRequiringBody = ['POST', 'PUT', 'PATCH'];
    if (methodsRequiringBody.includes(req.method)) {
      if (!req.body || Object.keys(req.body).length === 0) {
        logger.error(`[Request] Empty body in ${req.method} request.`);
        res.status(400).json({
          status: 400,
          message: 'Bad Request. Request body cannot be empty.',
        });
      }
    }
    return next();
  }

  if (req.is('multipart/form-data')) {
    if (!req.file) {
      logger.error(`[Request] Form-data must contain at least one file.`);
      res.status(400).json({
        status: 400,
        message: 'Bad Request. Form-data must contain at least one file.',
      });
    }
    return next();
  }

  logger.error(`[Request] Unsupported Content-Type: ${contentType}`);
  res.status(415).json({
    status: 415,
    message: 'Unsupported Content-Type in this request.',
  });
};

export default RequestMiddleware;
