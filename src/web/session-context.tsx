import { createContext, useContext, type ReactNode } from 'react';

import { useSupabaseSession, type SessionState } from '@/hooks/use-supabase-session';

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const session = useSupabaseSession();
  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error('useSession must be used inside SessionProvider.');
  }
  return value;
}
