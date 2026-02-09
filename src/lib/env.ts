import { z } from 'zod';

const trimValue = (value: unknown) => (typeof value === 'string' ? value.trim() : value);

const envSchema = z.object({
  VITE_SUPABASE_URL: z.preprocess(trimValue, z.string().url()),
  VITE_SUPABASE_ANON_KEY: z.preprocess(trimValue, z.string().min(1)),
});

const rawEnv = import.meta.env as Record<string, string | undefined>;

const candidateEnv = {
  VITE_SUPABASE_URL: rawEnv.VITE_SUPABASE_URL ?? rawEnv.EXPO_PUBLIC_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY:
    rawEnv.VITE_SUPABASE_ANON_KEY ?? rawEnv.EXPO_PUBLIC_SUPABASE_ANON_KEY,
};

const parsed = envSchema.safeParse(candidateEnv);

if (!parsed.success) {
  const invalid = parsed.error.issues
    .map((issue) => issue.path.join('.'))
    .filter(Boolean)
    .join(', ');

  const detectedKeys = [
    rawEnv.VITE_SUPABASE_URL ? 'VITE_SUPABASE_URL' : null,
    rawEnv.VITE_SUPABASE_ANON_KEY ? 'VITE_SUPABASE_ANON_KEY' : null,
    rawEnv.EXPO_PUBLIC_SUPABASE_URL ? 'EXPO_PUBLIC_SUPABASE_URL' : null,
    rawEnv.EXPO_PUBLIC_SUPABASE_ANON_KEY ? 'EXPO_PUBLIC_SUPABASE_ANON_KEY' : null,
  ].filter(Boolean);

  throw new Error(
    [
      'Missing or invalid environment configuration.',
      `Invalid or missing values: ${invalid || 'VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY'}.`,
      'Supported keys: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (preferred) or EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY.',
      detectedKeys.length > 0 ? `Detected keys: ${detectedKeys.join(', ')}.` : 'Detected keys: none.',
      'After changing .env, restart the dev server.',
    ].join(' ')
  );
}

export const env = parsed.data;
