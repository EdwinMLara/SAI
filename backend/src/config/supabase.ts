/**
 * Supabase client configuration
 * Initializes and configures Supabase client for storage services
 * Used primarily for file upload/download operations (documents and tickets)
 * Authentication sessions are disabled as this is a backend service
 */

import { createClient } from '@supabase/supabase-js';

import env from '@config/env';

/**
 * Configured Supabase client instance
 * Provides access to Supabase storage services with disabled auth persistence
 */
const supabase = createClient(env.SUPA_URL, env.SUPA_KEY, {
   auth: { persistSession: false },
});

export default supabase;
