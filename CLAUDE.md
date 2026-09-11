# CLAUDE.md

## Commands

- npm run dev - dev server
- npm run lint - ESLint
- npm run build - production build (requires env vars)

## Architecture

Next.js App Router. All data access goes through lib/db.ts using
postgres.js with parameterized queries - never interpolate SQL.

Two server-action layers:

- app/vehicules/actions.ts - PUBLIC (createReservationAction). Never
  accept admin handover fields (plate, mileage, damages, equipment,
  fees) here; they are only set via the admin actions.
- app/admin/actions.ts - ADMIN CRUD; every action is protected because
  middleware.ts guards /admin/:path* with the admin_session cookie.

Auth: single password (ADMIN_PASSWORD) + deterministic session token
sha256(password:ADMIN_SESSION_SECRET) in an httpOnly cookie. Login rate
limiting lives in lib/auth.ts (in-memory, resets on redeploy).

Database schema: schema.sql for fresh installs, migrations/ (002+)
incrementally for existing databases. Keep both paths working.

Contract PDF: lib/pdf/ContractDocument.tsx rendered via
app/admin/reservations/[id]/contract/route.tsx. Contract number is
assigned on confirmation (ARC-YYYY-NNNNN).

Pricing tiers are hardcoded in lib/pricing.ts keyed by price_per_day;
unknown prices fall back to a flat rate.

## Conventions

- TypeScript strict, Tailwind 4 (no tailwind.config), Framer Motion for
  animations
- Server components by default; "use client" only where needed
- i18n via lib/i18n (LanguageContext + translations.ts)
- Files must stay UTF-8 without BOM; watch for mojibake in user-visible
  strings