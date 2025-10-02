import express from 'express';

import env from '@config/env';

/* ------------------ Code ------------------ */

const app = express();

const server = app.listen(Number(env.SERVER_PORT), env.SERVER_IP, () => {
   console.log(`Express server ACTIVE on ${env.SERVER_IP}:${env.SERVER_PORT}`);
});

const gracefulShutdown = async () => {
   server.close(async () => {
      process.exit(0);
   });

   setTimeout(() => {
      process.exit(1);
   }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown());
process.on('SIGINT', () => gracefulShutdown());
