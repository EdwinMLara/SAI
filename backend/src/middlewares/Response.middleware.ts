import { Response, NextFunction, Request } from 'express';
import logger from '../utils/logger';

interface ApiResponse<T extends { message: string } = any> {
  status: number;
  data: T;
}

const ResponseMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const originalJson = res.json;

  res.json = function <T extends { message: string }>(data: T): Response {
    const formattedResponse: ApiResponse<T> = {
      status: res.statusCode,
      data: data,
    };

    logger.info(
      `[Response] ${formattedResponse.status}:${formattedResponse.data.message}`
    );

    return originalJson.call(this, formattedResponse);
  };

  next();
};

export default ResponseMiddleware;
