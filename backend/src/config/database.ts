import mongoose from 'mongoose';
import env from '@utils/env';
import log from '@utils/Logger.utils';

export const connect = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    log({
      level: 'debug',
      message: 'MongoDB connection established successfully',
    });
  } catch (error) {
    throw error;
  }
};

export const disconnect = async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    throw error;
  }
};
