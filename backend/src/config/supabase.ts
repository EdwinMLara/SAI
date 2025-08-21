import { createClient } from '@supabase/supabase-js';

import env from '@utils/env';

/* ------------------ Code ------------------ */

const supabase = createClient(env.SUPA_URL, env.SUPA_KEY, {
  auth: { persistSession: false },
});

export default supabase;
