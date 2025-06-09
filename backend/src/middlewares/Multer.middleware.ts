import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import logger from '../utils/logger';

const MulterMiddleware = multer({
  storage: multer.memoryStorage(),
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ): void => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'image/jpeg') {
      logger.info(`[Multer] File accepted: ${file.originalname}`);
      callback(null, true);
    } else {
      logger.error(`[Multer] Unsupported file type: ${file.mimetype}`);
      callback(null, false);
    }
  },
});

export default MulterMiddleware.single('file');
