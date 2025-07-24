import cors from 'cors';
import express from 'express';

import logger from '@utils/logger';
import env from '@utils/env';

import router from '@routes';
import * as Mongo from '@config/database';
import cookieParser from 'cookie-parser';

import RequestMiddleware from '@middlewares/Request.middleware';
import ResponseMiddleware from '@middlewares/Response.middleware';
import ErrorMiddleware from '@middlewares/Error.middleware';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use(RequestMiddleware);
app.use(ResponseMiddleware);

Mongo.connect();

app.use('/api', router);
app.use(ErrorMiddleware);

const server = app.listen(Number(env.SERVER_PORT), env.SERVER_IP, () => {
  logger.info(`[Express] Connected on  ${env.SERVER_IP}:${env.SERVER_PORT}`);
});

const gracefulShutdown = async (signal: string) => {
  logger.info(`[Express] ${signal} received. Shutting down server...`);

  server.close(async () => {
    await Mongo.disconnect();
    logger.info('[Express] Server closed.');
  });

  setTimeout(() => {
    logger.error('[Express] Forced shutdown due to timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
