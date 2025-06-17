import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const RequestMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.debug(`[Request] Received '${req.method}' request at '${req.url}'`);

  if (req.method === 'GET' || req.method === 'DELETE') {
    next();
    return;
  }

  if (req.is('application/json') || req.is('multipart/form-data')) {
    logger.debug(`[Request] Content-Type: ${req.headers['content-type']}`);

    const methods = ['POST', 'PUT', 'PATCH'];
    if (methods.includes(req.method)) {
      if (!req.body || Object.keys(req.body).length === 0) {
        logger.error(`[Request] Empty body in ${req.method} request.`);
        res.status(400).json({
          status: 400,
          message: 'Bad Request. Request body cannot be empty.',
        });
        return;
      }
    }

    if (req.is('multipart/form-data')) {
      if (!req.file) {
        logger.error(`[Request] Form-data must contain one file.`);
        res.status(400).json({
          status: 400,
          message: 'Bad Request. Form-data must contain one file.',
        });
        return;
      }
    }

    next();
  } else {
    logger.error(
      `[Request] Unsupported Content-Type: ${req.headers['content-type']}`
    );

    res.status(415).json({
      status: 415,
      message: 'Unsupported Content-Type in this request.',
    });
    return;
  }
};

export default RequestMiddleware;
