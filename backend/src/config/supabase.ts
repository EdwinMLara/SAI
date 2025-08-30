/**
 * Supabase client configuration
 * Initializes and configures Supabase client for storage services
 * Authentication sessions are disabled as this is a backend service
 */

import { createClient } from '@supabase/supabase-js';

import env from '@config/env';

/* ------------------ Code ------------------ */

/**
 * Configured Supabase client instance
 * Provides access to Supabase storage services
 */
const supabase = createClient(env.SUPA_URL, env.SUPA_KEY, {
   auth: { persistSession: false },
});

export default supabase;
