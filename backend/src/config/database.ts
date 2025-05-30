import mongoose from 'mongoose';
import logger from '../utils/logger';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      logger.warn('[Mongo] There is an issue with the environment variables.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    logger.info('[Mongo] Connected');
  } catch (error) {
    logger.error('[Mongo] DB connection failed', error);
    process.exit(1);
  }
};

export default connectDB;
