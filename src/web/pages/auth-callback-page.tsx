import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { completeAuthFromParsed, parseAuthParamsFromUrl } from '@/lib/auth-link';
import { supabase } from '@/lib/supabase';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const hasRun = useRef(false);
  const [message, setMessage] = useState('Finalizing your sign-in...');

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const finalize = async () => {
      try {
        const parsed = parseAuthParamsFromUrl(window.location.href);
        const result = await completeAuthFromParsed(parsed);
        if (result.handled) {
          if (result.sessionCreated) {
            navigate('/');
          } else {
            setMessage(result.message ?? 'Unable to sign in.');
          }
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          navigate('/');
          return;
        }

        setMessage('No auth data found in callback URL. Request a new magic link.');
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Unable to finish sign-in.');
      }
    };

    void finalize();
  }, [navigate]);

  return (
    <section className="panel">
      <h2>Auth callback</h2>
      <p className="muted">{message}</p>
    </section>
  );
}
