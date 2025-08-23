import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';

import env from '@config/env';
import router from '@routes';
import * as database from '@config/database';

import ErrorMiddleware from '@middlewares/Error.middleware';
import RequestMiddleware from '@middlewares/Request.middleware';
import ResponseMiddleware from '@middlewares/Response.middleware';

/* ------------------ Code ------------------ */

const app = express();

(async () => {
   await database.connect();
})();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(
   cors({
      origin: env.ORIGIN_SERVER,
      credentials: true,
   })
);

app.use(RequestMiddleware);
app.use(ResponseMiddleware);

app.use('/api', router);

app.use((req, res, next) => {
   res.status(404).json({ message: 'Route not found' });
});

app.use(ErrorMiddleware);

const server = app.listen(Number(env.SERVER_PORT), env.SERVER_IP, () => {
   console.log(`Express server on ${env.SERVER_IP}:${env.SERVER_PORT}`);
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
