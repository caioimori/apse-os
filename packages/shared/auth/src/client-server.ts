import { type CookieOptions, createServerClient as ssrCreateServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseAnonKey, getSupabaseUrl } from './types';

type CookieToSet = { name: string; value: string; options: CookieOptions };

export async function createServerClient() {
  const cookieStore = await cookies();
  return ssrCreateServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet: CookieToSet[]) => {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // `set` falha em Server Components — ok, middleware refresca a sessão
        }
      },
    },
  });
}
