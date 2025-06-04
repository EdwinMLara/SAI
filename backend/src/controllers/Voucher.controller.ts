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
  throw new Error('Missing environment variables for Supabase.');
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
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      call(null, true);
    } else {
      call(new Error('Unsupported Media Type. Only PNG and JPEG are allowed.'));
    }
  },
});

const saveImage = async (
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

    const { orderNumber } = req.body;
    if (!orderNumber) {
      res.status(400).json({
        error: 'Bad Request. Missing orderNumber in request body.',
      });
      return;
    }

    const filename: string = `image_${orderNumber}_${getFileExtension(req.file.originalname)}`;
    const bucket: string = 'vouchers';

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filename, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      logger.error('Error uploading file:', uploadError.message);
      res.status(500).json({
        error: 'Internal Server Error during file upload.',
      });
      return;
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename);

    if (!urlData) {
      logger.error('Error generating public URL: No data returned.');
      res.status(500).json({
        error: 'Internal Server Error generating public URL.',
      });
      return;
    }

    res.status(200).json({
      url: urlData.publicUrl,
      key: orderNumber,
      message: 'Image uploaded successfully.',
      filename: filename,
    });
  } catch (error) {
    logger.error('Error uploading image:', error);
    res.status(500).json({
      error: 'Internal Server Error.',
    });
  }
};

const getFileExtension = (filename: string): string => {
  const ext = filename.split('.').pop();
  return ext ? `.${ext}` : '';
};

router.post('/', preSave.single('image'), saveImage);

export default router;
