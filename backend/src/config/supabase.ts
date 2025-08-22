/**
 * Initializes and exports a Supabase client instance using environment variables.
 * The client is configured to not persist authentication sessions.
 * This allows interaction with Supabase services (database, auth, storage, etc.) throughout the application.
 */

import { createClient } from '@supabase/supabase-js';

import env from '@config/env';

/* ------------------ Code ------------------ */

const supabase = createClient(env.SUPA_URL, env.SUPA_KEY, {
  auth: { persistSession: false },
});

export default supabase;
