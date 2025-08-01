import { createClient } from '@supabase/supabase-js';
import logger from '@utils/logger';
import env from '@utils/env';

const supabase = createClient(env.SUPA_URL, env.SUPA_KEY, {
  auth: { persistSession: false },
});

logger.info('[Supabase] Connected Successfully');

export default supabase;
