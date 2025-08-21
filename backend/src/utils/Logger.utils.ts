import winston from 'winston';
import Transport from 'winston-transport';
import { LogMetadataInt } from '../interfaces/Logs.interfaces';
import env from '../config/env';

import LogModel from '../models/Log.model';

const isProduction = env.NODE_ENV === 'production';

let logger: winston.Logger;

if (isProduction) {
  class MongoTransport extends Transport {
    log(info: any, callback: () => void) {
      setImmediate(() => this.emit('logged', info));
      const { level, message, origin, metadata, timestamp } = info;
      if (!metadata) return callback();
      let ts: Date;
      if (timestamp instanceof Date) {
        ts = timestamp;
      } else if (typeof timestamp === 'string') {
        ts = new Date(timestamp);
      } else {
        ts = new Date();
      }
      let meta = { ...metadata };
      if (!meta.stackTrace || meta.stackTrace === '') {
        meta.stackTrace = '-';
      }
      const log = new LogModel({
        timestamp: ts,
        type: level,
        message,
        metadata: meta,
      });
      log.save();
    }
  }

  logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format((info) => {
        if (!info.timestamp) info.timestamp = new Date().toISOString();
        return info;
      })(),
      winston.format.json()
    ),
    transports: [new MongoTransport()],
  });
} else {
  logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message, origin }) => {
        return `${timestamp} [${level}]: ${message}`;
      })
    ),
    transports: [new winston.transports.Console()],
  });
}

type LogBase = {
  level: string;
  message: string;
};

type LogInput = LogBase & { metadata?: LogMetadataInt };

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
