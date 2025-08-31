import env from '@config/env';
import supabase from '@config/supabase';
import AppError from '@utils/system/AppError';
import responses from '@utils/system/responses';

/* ------------------ Code ------------------ */

const bucket = env.BUCKET_DOCS;

/**
 * Uploads a file to Supabase storage and returns its public URL
 * @param file - Multer file object containing file data and metadata
 * @param filename - Name to give the uploaded file
 * @returns Promise<string> - Public URL of the uploaded file
 * @throws AppError if upload fails
 */
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

/**
 * Deletes a file from Supabase storage
 * @param filename - Name of the file to delete
 * @returns Promise<void>
 * @throws AppError if deletion fails
 */
export async function deleteFile(filename: string): Promise<void> {
   const { error } = await supabase.storage.from(bucket).remove([filename]);
   if (error) {
      throw new AppError(responses.Document.uploadError, 500, error);
   }
}

/**
 * Updates an existing file by deleting the old one and uploading the new one
 * @param file - Multer file object containing new file data
 * @param filename - Name of the file to update
 * @returns Promise<string> - Public URL of the updated file
 */
export async function updateFile(
   file: Express.Multer.File,
   filename: string
): Promise<string> {
   await deleteFile(filename);
   const url = await uploadFile(file, filename);
   return url;
}

/**
 * Checks if a file exists in Supabase storage
 * @param filename - Name of the file to check
 * @returns Promise<boolean> - True if file exists, false otherwise
 */
export async function exists(filename: string): Promise<boolean> {
   const { data } = await supabase.storage.from(bucket).exists(filename);
   return data;
}

/**
 * Retrieves the public URL of a file from Supabase storage
 * @param filename - Name of the file to get URL for
 * @returns Promise<string> - Public URL of the file
 */
export async function getUrlFile(filename: string): Promise<string> {
   const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
   return data.publicUrl;
}
