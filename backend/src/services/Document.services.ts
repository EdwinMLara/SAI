import connectSupabase from '@config/supabase';
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
      });

    if (error) {
      throw new Error(error.message);
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filename);

    return {
      url: data.publicUrl,
    };
  } catch (error) {
    console.error(`Error generating URL: ${error}`);
    throw error;
  }
}

export async function searchURL(filename: string): Promise<{
  url: string;
}> {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filename);

  if (!data || !data.publicUrl) {
    throw new Error('Failed to retrieve the URL');
  }

  return {
    url: data.publicUrl,
  };
}

export async function deleteFile(filename: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([filename]);

  if (error) {
    throw new Error(`Error deleting file: ${error.message}`);
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
    console.error(`Error updating file: ${error}`);
    throw error;
  }
}

export async function search(filename: string): Promise<boolean> {
  const comprobe = await supabase.storage.from(bucket).exists(filename);
  return comprobe.data;
}
