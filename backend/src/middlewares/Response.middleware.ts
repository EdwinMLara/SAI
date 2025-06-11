import { Response, NextFunction, Request } from 'express';
import logger from '../utils/logger';

interface ApiResponse<T = any> {
  status: number;
  message?: string;
  data?: T;
}

const ResponseMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const originalJson = res.json;

  res.json = function <T>(data?: T): Response {
    const formattedResponse: ApiResponse<T> = {
      status: res.statusCode,
      message:
        res.statusMessage || (res.statusCode < 400 ? 'Success' : 'Error'),
      data: data ?? undefined,
    };

    logger.info(`[Response] ${formattedResponse.message}`);

    return originalJson.call(this, formattedResponse);
  };

  next();
};

export default ResponseMiddleware;
