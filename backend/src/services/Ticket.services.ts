import env from '@config/env';
import supabase from '@config/supabase';

import responses from '@responses';
import AppError from '@utils/system/AppError';

/* ------------------ Code ------------------ */

const bucket = env.BUCKET_TICKET;

export async function uploadFile(
  file: Express.Multer.File,
  filename: string
): Promise<string> {
  try {
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
  } catch (error) {
    throw error;
  }
}

export async function deleteFile(filename: string): Promise<void> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([filename]);
    if (error) {
      throw new AppError(responses.Document.uploadError, 500, error);
    }
  } catch (error) {
    throw error;
  }
}

export async function updateFile(
  file: Express.Multer.File,
  filename: string
): Promise<string> {
  try {
    await deleteFile(filename);
    const generate = await uploadFile(file, filename);
    return generate;
  } catch (error) {
    throw error;
  }
}

export async function exists(filename: string): Promise<boolean> {
  try {
    const { data } = await supabase.storage.from(bucket).exists(filename);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getUrlFile(filename: string): Promise<string> {
  try {
    const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
    return data.publicUrl;
  } catch (error) {
    throw error;
  }
}
