import { Request, Response, NextFunction } from 'express';

/* ------------------ Code ------------------ */

/**
 * Debug middleware for logging HTTP requests
 * Logs request details with color-coded output for better visualization
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
const DebugMiddleware = (
   req: Request,
   res: Response,
   next: NextFunction
): void => {
   const startTime = Date.now();

   // Color codes for console output
   const colors = {
      reset: '\x1b[0m',
      bright: '\x1b[1m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
      white: '\x1b[37m',
      gray: '\x1b[90m',
   };

   // Method color mapping
   const getMethodColor = (method: string): string => {
      switch (method) {
         case 'GET':
            return colors.green;
         case 'POST':
            return colors.blue;
         case 'PUT':
            return colors.yellow;
         case 'PATCH':
            return colors.magenta;
         case 'DELETE':
            return colors.red;
         default:
            return colors.white;
      }
   };

   // Get client IP
   const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

   // Format timestamp
   const timestamp = new Date().toLocaleString('es-ES', {
      timeZone: 'America/Mexico_City',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
   });

   // Log request start
   console.log(
      `${colors.gray}[${timestamp}]${colors.reset} ` +
         `${getMethodColor(req.method)}${colors.bright}${req.method}${colors.reset} ` +
         `${colors.cyan}${req.originalUrl}${colors.reset} ` +
         `${colors.gray}from ${clientIP}${colors.reset}`
   );

   // Print authCookie presence
   const hasAuthCookie = Boolean(req.cookies && req.cookies.authCookie);
   console.log(
      `${colors.gray}authCookie:${colors.reset} (${colors.cyan}${hasAuthCookie}${colors.reset})`
   );

   // Log request headers if present
   if (req.headers.authorization) {
      console.log(
         `${colors.gray}  Auth: ${req.headers.authorization.substring(0, 20)}...${colors.reset}`
      );
   }

   // Log request body for POST/PUT/PATCH (excluding sensitive data)
   if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      const sanitizedBody = { ...req.body };

      // Remove sensitive fields
      ['password', 'token', 'secret', 'key'].forEach((field) => {
         if (sanitizedBody[field]) {
            sanitizedBody[field] = '[HIDDEN]';
         }
      });

      console.log(
         `${colors.gray}  Body: ${JSON.stringify(sanitizedBody)}${colors.reset}`
      );
   }

   // Log query parameters if present
   if (Object.keys(req.query).length > 0) {
      console.log(
         `${colors.gray}  Query: ${JSON.stringify(req.query)}${colors.reset}`
      );
   }

   // Override res.json to capture response
   const originalJson = res.json;
   res.json = function (body: any) {
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Status color mapping
      const getStatusColor = (status: number): string => {
         if (status >= 200 && status < 300) return colors.green;
         if (status >= 300 && status < 400) return colors.yellow;
         if (status >= 400 && status < 500) return colors.red;
         if (status >= 500) return colors.red + colors.bright;
         return colors.white;
      };

      console.log(
         `${colors.gray}[${new Date().toLocaleString('es-ES', { timeZone: 'America/Mexico_City' })}]${colors.reset} ` +
            `${getStatusColor(res.statusCode)}${res.statusCode}${colors.reset} ` +
            `${colors.cyan}${req.originalUrl}${colors.reset} ` +
            `${colors.gray}(${duration}ms)${colors.reset}`
      );

      return originalJson.call(this, body);
   };

   next();
};

export default DebugMiddleware;
