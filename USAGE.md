# Development setup

## 1. Environment variables

Create `.env.local` (never commit it).

| Variable | How to get it |
|---|---|
| `DATABASE_URL` | Your Postgres connection string |
| `DATABASE_SSL` | `false` only for a local Postgres without TLS |
| `ADMIN_PASSWORD` | `openssl rand -hex 32` |
| `ADMIN_SESSION_SECRET` | `openssl rand -hex 32` |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard > Settings > API > service_role |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (used in signing links) |

## 2. Database (non-destructive)

    npm run db:migrate

- **Empty database:** applies `schema.sql` and records all migrations as applied.
- **Existing database (first time only, after a backup):** `npm run db:baseline`, then `npm run db:migrate`.
- **Later:** `npm run db:migrate` applies only new files from `migrations/`.

Nothing in this flow drops or deletes data. Never run `schema.sql` by hand on a database with data.

## 3. Run

    npm install
    npm run dev        # http://localhost:3000

## 4. Admin

Go to `/admin/real` and sign in with `ADMIN_PASSWORD`.

## 5. Lift a login ban

    DELETE FROM login_attempts WHERE ip = 'login:<ip-address>';