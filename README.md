# Gatherer (Web)

Gatherer is a privacy-first coordination website for small, trusted groups who gather regularly.
It focuses on event-scoped planning, arrival, and real-time coordination.

## Tech stack

- React + TypeScript
- Vite
- React Router
- TanStack Query
- Zod
- Supabase (Postgres, Auth, Realtime, Edge Functions, Storage)

## Environment

Create a local `.env` file:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

`.env.example` includes the required keys.

## Commands

- Install: `npm install`
- Run local dev server: `npm run dev` (or `npm start`)
- Build: `npm run build`
- Preview production build: `npm run preview`
- Lint: `npm run lint`

## Repo layout

- `src/App.tsx` : app routes and shell
- `src/web/` : website pages, layout, and styles
- `src/features/` : Supabase domain query/mutation modules
- `src/lib/` : env parsing, Supabase client, query client, auth parsing helpers
- `src/hooks/use-supabase-session.ts` : shared session hook
- `scripts/supabase-setup.sql` : schema/RLS source of truth
- `supabase/functions/notify-event` : notification edge function

## Supabase setup

Run `scripts/supabase-setup.sql` in the Supabase SQL editor to bootstrap or update schema/RLS policies.

The app uses magic link auth and callback path:

- `http://localhost:5173/auth/callback` for local development
- Your deployed web URL with `/auth/callback` in production

## License

AGPL-3.0. See [LICENSE](LICENSE).
