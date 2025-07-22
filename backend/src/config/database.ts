import mongoose from 'mongoose';
import logger from '@utils/logger';
import env from '@utils/env';

export const connect = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info('[Mongo] Connected Successfully');
  } catch (error) {
    throw error;
  }
};

export const disconnect = async () => {
  try {
    await mongoose.disconnect();
    logger.info('[Mongo] Disconnected Successfully');
  } catch (error) {
    throw error;
  }
};
