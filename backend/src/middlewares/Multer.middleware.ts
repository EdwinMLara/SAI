import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';

import AppError from '@utils/system/AppError';

/* ------------------ Code ------------------ */

/**
 * Multer configuration for file uploads
 * Accepts PDF and JPEG files with 5MB size limit
 * Uses memory storage for temporary file handling
 */
const upload = multer({
   storage: multer.memoryStorage(),
   limits: { fileSize: 5 * 1024 * 1024 },
   fileFilter: (
      req: Request,
      file: Express.Multer.File,
      callback: FileFilterCallback
   ): void => {
      if (
         file.mimetype === 'application/pdf' ||
         file.mimetype === 'image/jpeg' ||
         file.mimetype === 'image/png' ||
         file.mimetype === 'image/jpg'
      ) {
         callback(null, true);
      } else {
         callback(new AppError('archivo no permitido'));
      }
   },
});

/**
 * File upload middleware that requires a file to be present in the request
 * Validates file type and ensures file is provided
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * @throws AppError if file is invalid or missing
 */
function requireFile(req: Request, res: Response, next: NextFunction) {
   try {
      upload.single('file')(req, res, (err: unknown) => {
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
