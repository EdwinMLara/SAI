import { createClient } from '@supabase/supabase-js';
import logger from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const connectSupabase = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    logger.error('[Supabase] Missing environment variables');
    process.exit(1);
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: { persistSession: false },
      }
    );

    logger.info('[Supabase] Connected Successfully');
    return supabase;
  } catch (error) {
    logger.error('[Supabase] Connection failed', error);
    process.exit(1);
  }
};

export default connectSupabase;
