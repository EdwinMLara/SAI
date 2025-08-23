import env from '@config/env';
import supabase from '@config/supabase';

import responses from '@utils/responses';
import AppError from '@utils/system/AppError';

/* ------------------ Code ------------------ */

const bucket = env.BUCKET_DOCS;

export async function uploadFile(
   file: Express.Multer.File,
   filename: string
): Promise<string> {
   const { error } = await supabase.storage
      .from(bucket)
      .upload(filename, file.buffer, {
         contentType: file.mimetype,
         upsert: false,
      });

   if (error) {
      throw new AppError(responses.Document.uploadError, 500, error);
   }
   const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
   return data.publicUrl;
}

export async function deleteFile(filename: string): Promise<void> {
   const { error } = await supabase.storage.from(bucket).remove([filename]);
   if (error) {
      throw new AppError(responses.Document.uploadError, 500, error);
   }
}

export async function updateFile(
   file: Express.Multer.File,
   filename: string
): Promise<string> {
   await deleteFile(filename);
   const url = await uploadFile(file, filename);
   return url;
}

export async function exists(filename: string): Promise<boolean> {
   const { data } = await supabase.storage.from(bucket).exists(filename);
   return data;
}

export async function getUrlFile(filename: string): Promise<string> {
   const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
   return data.publicUrl;
}
