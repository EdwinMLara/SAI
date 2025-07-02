import connectSupabase from '@config/supabase';
import logger from '@utils/logger';

const bucket = process.env.BUCKET_VOUCHERS || 'documents';
const supabase = connectSupabase();

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
      logger.error('Error uploading file to Supabase:', error);
      throw new Error(error.message);
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filename);

    return {
      url: data.publicUrl,
    };
  } catch (error) {
    logger.error(`Error generating URL: ${error}`);
    throw error;
  }
}

export async function searchURL(filename: string): Promise<{
  url: string;
}> {
  try {
    const { data } = supabase.storage.from(bucket).getPublicUrl(filename);

    if (!data || !data.publicUrl) {
      throw new Error('Failed to retrieve the URL');
    }

    return {
      url: data.publicUrl,
    };
  } catch (error) {
    logger.error(`Error searching URL for ${filename}:`, error);
    throw error;
  }
}

export async function deleteFile(filename: string): Promise<void> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([filename]);

    if (error) {
      logger.error('Error deleting file from Supabase:', error);
      throw new Error(`Error deleting file: ${error.message}`);
    }
  } catch (error) {
    logger.error(`Error deleting file ${filename}:`, error);
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
    logger.error(`Error updating file: ${error}`);
    throw error;
  }
}

export async function search(filename: string): Promise<boolean> {
  try {
    const { data } = await supabase.storage.from(bucket).exists(filename);
    return data || false;
  } catch (error) {
    logger.error(`Error checking file existence for ${filename}:`, error);
    return false;
  }
}
