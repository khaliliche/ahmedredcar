-- 014_rate_limits.sql
-- Fixed-window counter used by the public reservation form
-- (lib/db.ts: consumeWindowedLimit). Additive and idempotent.
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now()
);
