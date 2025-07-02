import connectSupabase from '@config/supabase';
import logger from '@utils/logger';

const bucket = process.env.BUCKET_TICKETS || 'tickets';
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
      logger.error('Error uploading ticket to Supabase:', error);
      throw new Error(error.message);
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filename);

    return {
      url: data.publicUrl,
    };
  } catch (error) {
    logger.error(`Error generating URL for ticket: ${error}`);
    throw error;
  }
}

export async function searchURL(filename: string): Promise<{
  url: string;
}> {
  try {
    const { data } = supabase.storage.from(bucket).getPublicUrl(filename);

    if (!data || !data.publicUrl) {
      throw new Error('Failed to retrieve the ticket URL');
    }

    return {
      url: data.publicUrl,
    };
  } catch (error) {
    logger.error(`Error searching URL for ticket ${filename}:`, error);
    throw error;
  }
}

export async function deleteFile(filename: string): Promise<void> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([filename]);

    if (error) {
      logger.error('Error deleting ticket from Supabase:', error);
      throw new Error(`Error deleting ticket: ${error.message}`);
    }
  } catch (error) {
    logger.error(`Error deleting ticket ${filename}:`, error);
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
    logger.error(`Error updating ticket: ${error}`);
    throw error;
  }
}

export async function search(filename: string): Promise<boolean> {
  try {
    const { data } = await supabase.storage.from(bucket).exists(filename);
    return data || false;
  } catch (error) {
    logger.error(`Error checking ticket existence for ${filename}:`, error);
    return false;
  }
}
