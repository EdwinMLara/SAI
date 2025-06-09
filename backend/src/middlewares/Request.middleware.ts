import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const RequestMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.is('application/json') || req.is('multipart/form-data')) {
    logger.debug(
      `[Request] Accepted content type: ${req.headers['content-type']}`
    );

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

    next();
  } else {
    logger.error(
      `[Request] Unsupported content type: ${req.headers['content-type']}`
    );

    res.status(415).json({
      status: 415,
      message: 'Unsupported Media Type in this request.',
    });
    return;
  }
};

export default RequestMiddleware;
