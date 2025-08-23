import mongoose from 'mongoose';

import env from '@config/env';

/* ------------------ Code ------------------ */

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * Logs a message indicating whether the connection was successful or failed.
 * @returns {Promise<void>} Resolves when the connection process is complete.
 */
export const connect = async (): Promise<void> => {
   try {
      await mongoose.connect(env.MONGO_URI);
      console.log('Mongoose connection successful');
   } catch (error) {
      console.log('Mongoose connection failed', error);
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
      console.log('Mongoose disconnection successful');
   } catch (error) {
      console.log('Mongoose disconnection failed', error);
   }
};
