# Development setup

## 1. Environment variables

Create a local `.env.local` file (never commit it). Generate the values with the commands below.

    chmod 600 .env.local

| Variable | How to get it |
|---|---|
| `DATABASE_URL` | Your Postgres connection string |
| `ADMIN_PASSWORD` | `openssl rand -hex 32` |
| `ADMIN_SESSION_SECRET` | `openssl rand -hex 32` |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → service_role |

## 2. Database

### Fresh database (no data)

    psql "$DATABASE_URL" -f schema.sql

### Existing production database (data already present)

Run only the new migration — it adds one table without touching anything else:

    psql "$DATABASE_URL" -f migrations/007_login_attempts.sql

### Shortcut for both (requires Node.js 22+)

    node scripts/init-db.mjs          # requires SSL (default)
    DATABASE_SSL=false node scripts/init-db.mjs   # local Postgres without TLS

## 3. Run the dev server

    npm install
    npm run dev        # http://localhost:3000

## 4. Admin access

Navigate to `/admin/real` — you are redirected to `/admin/real/login` to enter the password stored in `ADMIN_PASSWORD`.

## 5. Login ban

After **4 failed password attempts** from the same IP, that IP is banned for **24 hours**. The ban is stored in the `login_attempts` table (Postgres), so it survives server restarts and cookie clearing.

A banned client sees the login page but receives no error message on submit — they are silently redirected back to the form.

To manually lift a ban:

    DELETE FROM login_attempts WHERE ip = 'login:<your-ip>';
