import supabase from '@config/supabase';
import logger from '@utils/logger';
import responses from '@utils/responses';
import AppError from '@utils/AppError';
import env from '@utils/env';

const bucket = env.BUCKET_TICKET;

export async function generateURL(
  file: Express.Multer.File,
  filename: string
): Promise<{ url: string }> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new Error(responses.SERVER_ERROR);
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filename);

    return {
      url: data.publicUrl,
    };
  } catch (error) {
    throw error;
  }
}

export async function searchURL(filename: string): Promise<{
  url: string;
}> {
  try {
    const { data } = supabase.storage.from(bucket).getPublicUrl(filename);

    if (!data || !data.publicUrl) {
      throw new Error(responses.SERVER_ERROR);
    }

    return {
      url: data.publicUrl,
    };
  } catch (error) {
    throw error;
  }
}

export async function deleteFile(filename: string): Promise<void> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([filename]);

    if (error) {
      throw new Error(responses.SERVER_ERROR);
    }
  } catch (error) {
    throw error;
  }
}

export async function updateFile(
  file: Express.Multer.File,
  filename: string
): Promise<{ url: string }> {
  try {
    await deleteFile(filename);
    const generate = await generateURL(file, filename);
    return { url: generate.url };
  } catch (error) {
    throw error;
  }
}

export async function search(filename: string): Promise<boolean> {
  try {
    const { data } = await supabase.storage.from(bucket).exists(filename);
    return data || false;
  } catch (error) {
    throw error;
  }
}
