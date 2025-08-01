import { createClient } from '@supabase/supabase-js';
import log from '@utils/Logger.utils';
import env from '@utils/env';

const supabase = createClient(env.SUPA_URL, env.SUPA_KEY, {
  auth: { persistSession: false },
});

log({
  level: 'debug',
  message: 'Supabase connection established successfully',
});

export default supabase;
