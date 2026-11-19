import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Default project public credentials for production fallback (e.g. Vercel deployments)
const DEFAULT_SUPABASE_URL = 'https://lrganaxgbgzyvvjhyaiz.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_sXtBQO6qdrHVgkBQzg0aHQ_zpNxdSDd';

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || DEFAULT_SUPABASE_URL;
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    supabaseAnonKey.length > 20
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function getSupabaseConfig() {
  return {
    url: supabaseUrl || '',
    anonKey: supabaseAnonKey || '',
    isConfigured: isSupabaseConfigured,
  };
}
