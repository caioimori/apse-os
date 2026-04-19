import { createBrowserClient as ssrCreateBrowserClient } from '@supabase/ssr';
import { getSupabaseAnonKey, getSupabaseUrl } from './types';

// TODO: re-introduzir <Database> quando types.ts gerado bater com versão do @supabase/supabase-js.
// Por ora client é não-tipado — validação de schema via zod nos contracts.
export function createBrowserClient() {
  return ssrCreateBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
}
