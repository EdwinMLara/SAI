import { Request, Response, NextFunction } from 'express';

import { StandardResponse } from '@cmm_interfaces/index';

/**
 * Response formatting middleware
 * Standardizes all API responses with consistent structure
 * Transforms response data into a standard format with status, success flag, message, and data
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
const ResponseMiddleware = (
   req: Request,
   res: Response,
   next: NextFunction
): void => {
   const originalJson = res.json;

   res.json = function <T = unknown>(
      payload: Record<string, unknown>
   ): Response {
      const response: StandardResponse<T> = {
         status: res.statusCode,
         success: res.statusCode < 400,
         message: payload.message as string,
         data: (payload.data as T) ?? (payload as T) ?? null,
      };

      return originalJson.call(this, response);
   };

   next();
};

export default ResponseMiddleware;
