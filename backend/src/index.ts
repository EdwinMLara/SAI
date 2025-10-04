import express from 'express';

import env from '@config/env';
import * as database from '@config/database';

/* ------------------ Code ------------------ */

const app = express();

/* ------ Server Connection ------ */

(async () => {
   try {
      await database.connect();
      const server = app.listen(Number(env.SERVER_PORT), env.SERVER_IP, () => {
         console.log(
            `Express server ACTIVE on ${env.SERVER_IP}:${env.SERVER_PORT}`
         );
      });

      const gracefulShutdown = async () => {
         server.close(async () => {
            await database.disconnect();
            process.exit(0);
         });
         setTimeout(() => {
            process.exit(1);
         }, 10000);
      };

      process.on('SIGTERM', () => gracefulShutdown());
      process.on('SIGINT', () => gracefulShutdown());
   } catch (error) {
      await database.disconnect();
      process.exit(1);
   }
})();
