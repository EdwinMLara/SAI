import { Response, NextFunction, Request } from 'express';

interface ApiResponse<T = any> {
  success: boolean;
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
      success: res.statusCode < 400,
      status: res.statusCode,
      message:
        res.statusMessage || (res.statusCode < 400 ? 'Success' : 'Error'),
      data: data ?? undefined,
    };

    return originalJson.call(this, formattedResponse);
  };

  next();
};

export default ResponseMiddleware;
