import mongoose from 'mongoose';

import env from './env';

/* ------------ Code ------------ */

export const connect = async (): Promise<void> => {
   try {
      await mongoose.connect(env.MONGO_URI);
      console.log('Mongoose connection successful');
   } catch (error) {
      console.log('Mongoose connection failed', error);
      throw error;
   }
};

export const disconnect = async (): Promise<void> => {
   try {
      await mongoose.disconnect();
      console.log('Mongoose disconection successful');
   } catch (error) {
      console.log('Mongoose disconnection failed', error);
   }
};
