import { Request, Response, NextFunction } from 'express';

const RequestMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.is('application/json')) {
    res.status(415).json({
      status: 415,
      message: 'Unsupported Media Type. Please send JSON data.',
    });
    return;
  }

  const methods = ['POST', 'PUT', 'PATCH'];
  if (methods.includes(req.method)) {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({
        status: 400,
        message: 'Bad Request. Request body cannot be empty.',
      });
      return;
    }
  }

  next();
};

export default RequestMiddleware;
