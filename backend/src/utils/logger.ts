import winston from 'winston';
import env from '@utils/env';

const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ message: true }),
        winston.format.printf(({ level, message, ...meta }) => {
          return `${message} ${
            Object.keys(meta).length ? JSON.stringify(meta) : ''
          }`;
        })
      ),
    }),
  ],
});

export default logger;
