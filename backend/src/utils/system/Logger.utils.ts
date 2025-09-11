import winston from 'winston';
import Transport from 'winston-transport';

import env from '@config/env';
import LogModel from '@models/Log.model';
import { LogMetadataInt } from '@cmm_interfaces/system/Logs.interfaces';

/**
 * Type definitions for logging system
 */
type LogBase = {
   level: string;
   message: string;
};
type LogInput = LogBase & { metadata?: LogMetadataInt };

let logger: winston.Logger;
const isProduction = env.NODE_ENV === 'production';

/**
 * Production logging system configuration
 * Uses MongoDB as the log storage backend for persistent logging
 */
if (isProduction) {
   /**
    * Custom Winston transport for MongoDB logging
    * Saves log entries directly to MongoDB for production environments
    */
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

         console.log(log);
         log.save();
      }
   }

   logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(winston.format.json()),
      transports: [new MongoTransport()],
   });
} else {
   /**
    * Development logging configuration
    * Uses console output for immediate debugging feedback
    */
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

/**
 * Main logging function that handles both production and development environments
 * In production: logs to MongoDB with metadata
 * In development: logs to console for immediate feedback
 * @param level - Log level (info, warn, error, debug)
 * @param message - Log message content
 * @param metadata - Optional metadata for production logging
 */
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
