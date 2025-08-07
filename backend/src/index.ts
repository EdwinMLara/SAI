import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';

import router from '@routes';
import * as Mongo from '@config/database';

import env from '@utils/env';
import log from '@utils/Logger.utils';

import ErrorMiddleware from '@middlewares/Error.middleware';
import RequestMiddleware from '@middlewares/Request.middleware';
import ResponseMiddleware from '@middlewares/Response.middleware';

/* ------------------ Code ------------------ */

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: env.ORIGIN_SERVER,
    credentials: true,
  })
);

app.use(RequestMiddleware);
app.use(ResponseMiddleware);

Mongo.connect();

app.use('/api', router);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(ErrorMiddleware);

const server = app.listen(Number(env.SERVER_PORT), env.SERVER_IP, () => {
  log({
    level: 'debug',
    message: `Express server on ${env.SERVER_IP}:${env.SERVER_PORT}`,
  });
});

const gracefulShutdown = async (signal: string) => {
  server.close(async () => {
    await Mongo.disconnect();
    log({
      level: 'debug',
      message: 'Express server OFF',
    });
  });

  setTimeout(() => {
    log({
      level: 'debug',
      message: 'Database connection not closed in time',
    });
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
