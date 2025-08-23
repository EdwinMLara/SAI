import mongoose from 'mongoose';
import winston from 'winston';

import env from '@config/env';

const logger = winston.createLogger({
   level: 'info',
   format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
   ),
   transports: [new winston.transports.Console()],
});

/* ------------------ Code ------------------ */

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * Logs a message indicating whether the connection was successful or failed.
 * @returns {Promise<void>} Resolves when the connection process is complete.
 */
export const connect = async (): Promise<void> => {
   try {
      await mongoose.connect(env.MONGO_URI);
      logger.info('Mongoose connection successful');
   } catch (error) {
      logger.error('Mongoose connection failed', error);
   }
};

/**
 * Disconnects from the MongoDB database using Mongoose.
 * Logs a message indicating whether the disconnection was successful or failed.
 * @returns {Promise<void>} Resolves when the disconnection process is complete.
 */
export const disconnect = async (): Promise<void> => {
   try {
      await mongoose.disconnect();
      logger.info('Mongoose disconnection successful');
   } catch (error) {
      logger.error('Mongoose disconnection failed', error);
   }
};
