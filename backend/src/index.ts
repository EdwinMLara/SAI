import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import logger from './utils/logger';

import router from './routes/api.routes';
import * as Mongo from './config/database';

import RequestMiddleware from './middlewares/Request.middleware';
import ResponseMiddleware from './middlewares/Response.middleware';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(RequestMiddleware);
app.use(ResponseMiddleware);

Mongo.connect();

app.use('/api', router);

const PORT = process.env.PORT || 5001;
const toListen = process.env.LOCAL_IP || '0.0.0.0';

const server = app.listen(Number(PORT), String(toListen), () => {
  logger.info(`[Express] Connected on  ${toListen}:${PORT}`);
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
