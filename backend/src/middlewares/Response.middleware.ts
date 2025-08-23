import { Request, Response, NextFunction } from 'express';

import { StandardResponse } from '@cmm_interfaces/index';

/* ------------------ Code ------------------ */

const ResponseMiddleware = (
   req: Request,
   res: Response,
   next: NextFunction
): void => {
   const originalJson = res.json;

   res.json = function <T = any>(payload: any): Response {
      const response: StandardResponse<T> = {
         status: res.statusCode,
         success: res.statusCode < 400,
         message: payload.message,
         data: payload.data ?? payload ?? null,
      };

      return originalJson.call(this, response);
   };

   next();
};

export default ResponseMiddleware;
