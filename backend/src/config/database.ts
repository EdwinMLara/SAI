import mongoose from 'mongoose';
import winston from 'winston';

import env from '@config/env';

/**
 * Winston logger configuration for database connection events
 * Provides structured logging for MongoDB connection status
 */
const logger = winston.createLogger({
   level: 'info',
   format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
   ),
   transports: [new winston.transports.Console()],
});

/**
 * Establishes a connection to the MongoDB database using Mongoose
 * Uses environment configuration for connection URI and handles connection errors
 * @returns Promise<void> - Resolves when connection process is complete
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
 * Safely disconnects from the MongoDB database using Mongoose
 * Logs the disconnection process and handles potential errors
 * @returns Promise<void> - Resolves when disconnection process is complete
 */
export const disconnect = async (): Promise<void> => {
   try {
      await mongoose.disconnect();
      logger.info('Mongoose disconnection successful');
   } catch (error) {
      logger.error('Mongoose disconnection failed', error);
   }
};
