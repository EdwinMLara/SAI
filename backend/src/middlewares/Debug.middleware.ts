import { Request, Response, NextFunction } from 'express';

/* ------------------ Code ------------------ */

const DebugMiddleware = (
   req: Request,
   res: Response,
   next: NextFunction
): void => {
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

   const methodColor =
      {
         GET: colors.green,
         POST: colors.blue,
         PUT: colors.yellow,
         PATCH: colors.magenta,
         DELETE: colors.red,
      }[req.method] || colors.white;

   console.log(`\n${colors.gray}${'─'.repeat(40)}${colors.reset}`);
   console.log(`${colors.bright}${colors.cyan}--- REQUEST ---${colors.reset}`);
   console.log(
      `${colors.gray}Tipo de peticion:${colors.reset} ${methodColor}${req.method}${colors.reset} ${colors.cyan}${req.originalUrl}${colors.reset}`
   );
   console.log(
      `${colors.gray}Authorizacion:${colors.reset} ${colors.yellow}${Boolean(req.cookies?.authCookie)}${colors.reset}`
   );
   console.log(
      `${colors.gray}req.body:${colors.reset} ${colors.white}${JSON.stringify(req.body)}${colors.reset}`
   );

   const originalJson = res.json;

   res.json = function (body: any) {
      console.log(
         `\n${colors.bright}${colors.cyan}--- RESPONSE ---${colors.reset}`
      );
      if (body && typeof body === 'object') {
         if ('status' in body) {
            console.log(
               `${colors.gray}Status:${colors.reset} ${colors.green}${body.status}${colors.reset}`
            );
         }
         if ('message' in body) {
            console.log(
               `${colors.gray}Message:${colors.reset} ${colors.blue}${body.message}${colors.reset}`
            );
         }
      }
      console.log(
         `${colors.gray}Estandart Response:${colors.reset} ${colors.green}${JSON.stringify(body)}${colors.reset}`
      );
      console.log(`${colors.gray}${'─'.repeat(40)}${colors.reset}\n`);
      return originalJson.call(this, body);
   };

   next();
};

export default DebugMiddleware;
