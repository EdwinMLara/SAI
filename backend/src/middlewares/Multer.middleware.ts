import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';
import responses from '@utils/responses';
import logger from '@utils/logger';

const upload = multer({
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
      callback(new Error(responses.INVALID_FILETYPE));
    }
  },
});

function fileRequiredMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  upload.single('file')(req, res, (err: any) => {
    if (err) {
      logger.error(`[Multer] Upload error: ${err.message}`);
      return res.status(415).json({ message: err.message });
    }
    if (!req.file) {
      logger.error(`[Multer] No file provided in request.`);
      return res.status(400).json({ message: responses.REQUIRED_FILE });
    }
    next();
  });
}

export default fileRequiredMiddleware;
