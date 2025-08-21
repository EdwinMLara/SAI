import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';

import responses from '@responses';
import AppError from '@utils/system/AppError';

/* ------------------ Code ------------------ */

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ): void => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'image/jpeg') {
      callback(null, true);
    } else {
      callback(new AppError('archivo no permitido'));
    }
  },
});

function requireFile(req: Request, res: Response, next: NextFunction) {
  try {
    upload.single('file')(req, res, (err: any) => {
      try {
        if (err) {
          throw new AppError('Tipo de archivo no permitido', 415);
        }
        if (!req.file) {
          throw new AppError('El archivo es requerido', 400);
        }
        next();
      } catch (error) {
        next(error);
      }
    });
  } catch (error) {
    next(error);
  }
}

export default requireFile;
