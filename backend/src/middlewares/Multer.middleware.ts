import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import logger from '@utils/logger';

const FileFilter = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
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

export default FileFilter.single('file');
