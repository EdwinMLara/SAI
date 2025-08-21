import mongoose from 'mongoose';

import env from '@config/env';

/* ------------------ Code ------------------ */

export const connect = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('Mongoose connection successful');
  } catch (error) {
    console.log('Mongoose connection failed', error);
  }
};

export const disconnect = async () => {
  try {
    await mongoose.disconnect();
    console.log('Mongoose disconnection successful');
  } catch (error) {
    console.log('Mongoose disconnection failed', error);
  }
};
