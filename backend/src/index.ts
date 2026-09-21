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

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowed =
        /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i.test(origin) ||
        /^https?:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/i.test(origin) ||
        /^https?:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/i.test(origin) ||
        /^https?:\/\/172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}(:\d+)?$/i.test(origin);
      if (allowed) return callback(null, true);
      return callback(new Error('Origin not allowed by CORS'));
    },
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
