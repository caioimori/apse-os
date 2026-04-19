import type { User } from '@supabase/supabase-js';

export type AuthUser = Pick<User, 'id' | 'email' | 'user_metadata'>;

function readPublicEnv(name: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY'): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

export function getSupabaseUrl(): string {
  return readPublicEnv('NEXT_PUBLIC_SUPABASE_URL');
}

export function getSupabaseAnonKey(): string {
  return readPublicEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
}
