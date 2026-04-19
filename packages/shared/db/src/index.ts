import { type SupabaseClient, createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export type ApseDb = SupabaseClient<Database>;

export function createBrowserClient(url: string, anonKey: string): ApseDb {
  return createClient<Database>(url, anonKey);
}
