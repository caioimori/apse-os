'use client';

import type { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { createBrowserClient } from './client-browser';

type UseUserState = {
  user: User | null;
  loading: boolean;
};

export function useUser(): UseUserState {
  const [state, setState] = useState<UseUserState>({ user: null, loading: true });

  useEffect(() => {
    const supabase = createBrowserClient();
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setState({ user: data.user, loading: false });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setState({ user: session?.user ?? null, loading: false });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
