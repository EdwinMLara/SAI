import mongoose from 'mongoose';
import winston from 'winston';

import env from '@config/env';

/**
 * Establishes a connection to the MongoDB database using Mongoose
 * Uses environment configuration for connection URI and handles connection errors
 * @returns Promise<void> - Resolves when connection process is complete
 */
export const connect = async (): Promise<void> => {
   try {
      await mongoose.connect(env.MONGO_URI);
      console.log('Mongoose connection successful');
   } catch (error) {
      console.error('Mongoose connection failed', error);
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
      console.log('Mongoose disconnection successful');
   } catch (error) {
      console.error('Mongoose disconnection failed', error);
   }
};
