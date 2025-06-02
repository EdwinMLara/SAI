import express, { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();

const router = express.Router();

if (
  !process.env.SUPABASE_URL ||
  !process.env.SUPABASE_KEY ||
  !process.env.BUCKET_NAME
) {
  logger.error('[Supabase] There is an issue with the environment variables.');
  throw new Error();
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

interface UploadResponse {
  url: string;
  key: string;
  message: string;
  filename: string;
}

interface ErrorResponse {
  error: string;
}

const preSave = multer({
  storage: multer.memoryStorage(),
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    call: FileFilterCallback
  ): void => {
    if (file.mimetype === 'application/pdf') {
      call(null, true);
    } else {
      call(new Error('Unsupported Media Type.'));
    }
  },
});

const saveDocument = async (
  req: MulterRequest,
  res: Response<UploadResponse | ErrorResponse>
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        error: 'Bad Request. Request file cannot be empty.',
      });
      return;
    }

    if (!process.env.BUCKET_NAME) {
      logger.error(
        '[Supabase] There is an issue with the environment variables.'
      );
      throw new Error();
    }

    const order: string = req.body.orderNumber;
    const filename: string = `invoice_${order}.pdf`;
    const bucket: string = process.env.BUCKET_NAME;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filename, req.file.buffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (error) {
      logger.error('Error uploading file:', error);
      res.status(500).json({
        error: 'Internal Server Error.',
      });
      return;
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename);

    res.status(200).json({
      url: urlData.publicUrl,
      key: order,
      message: 'PDF subido correctamente',
      filename: filename,
    });
  } catch (error) {
    logger.error('Error uploading file:', error);
    res.status(500).json({
      error: 'Internal Server Error.',
    });
  }
};

router.post('/', preSave.single('pdf'), saveDocument);

export default router;
