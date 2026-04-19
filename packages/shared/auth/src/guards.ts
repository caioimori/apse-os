import type { User } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { createServerClient } from './client-server';

export async function requireUser(nextPath = '/'): Promise<User> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  return user;
}
