import { useEffect, useRef, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import { ensureProfile } from '@/features/profiles/profile-service';

type SessionState = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
};

export function useSupabaseSession(): SessionState {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const lastProfileUserId = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session ?? null);
      setIsLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      setSession(nextSession);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const userId = session?.user?.id ?? null;
    if (!userId || userId === lastProfileUserId.current) return;
    lastProfileUserId.current = userId;
    ensureProfile(session?.user).catch(() => undefined);
  }, [session?.user]);

  return { session, user: session?.user ?? null, isLoading };
}
