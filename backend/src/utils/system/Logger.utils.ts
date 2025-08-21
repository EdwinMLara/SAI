import winston from 'winston';
import Transport from 'winston-transport';

import env from '@config/env';
import LogModel from '@models/Log.model';
import { LogMetadataInt } from '@interfaces/Logs.interfaces';

/* ------------------ Code ------------------ */

type LogBase = {
  level: string;
  message: string;
};
type LogInput = LogBase & { metadata?: LogMetadataInt };

let logger: winston.Logger;
const isProduction = env.NODE_ENV === 'production';

if (isProduction) {
  class MongoTransport extends Transport {
    log(info: LogInput) {
      setImmediate(() => this.emit('logged', info));
      const { level, message, metadata } = info;

      const date = new Date();

      // Guardar registro en base de datos
      const log = new LogModel({
        timestamp: date,
        type: level,
        message,
        metadata: metadata,
      });
      log.save();
    }
  }

  logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.json()),
    transports: [new MongoTransport()],
  });
} else {
  logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
      winston.format.printf(({ level, message }) => {
        return `[${level}]: ${message}`;
      })
    ),
    transports: [new winston.transports.Console()],
  });
}

function log({ level, message, metadata }: LogInput) {
  if (isProduction) {
    if (!metadata) return;
    logger.log({
      level,
      message,
      metadata,
    });
  } else {
    logger.log({
      level,
      message,
    });
  }
}

export default log;
