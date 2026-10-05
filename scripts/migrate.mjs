// Safe, non-destructive database runner.
//   node scripts/migrate.mjs               apply pending migrations
//                                          (empty DB: schema.sql + mark all applied)
//   node scripts/migrate.mjs --baseline 008  existing DB: mark migrations up to 008
//                                          as already applied WITHOUT running them
// Env: DATABASE_URL (or .env.local), DATABASE_SSL=false for local Postgres.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stripBom = (t) => t.replace(/^\uFEFF/, "");

function loadEnvLocal() {
  const p = join(root, ".env.local");
  if (!existsSync(p)) return;
  for (const line of stripBom(readFileSync(p, "utf8")).split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 1) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim().replace(/^"|"$/g, "");
    if (!(k in process.env)) process.env[k] = v;
  }
}
loadEnvLocal();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is missing (env or .env.local).");
  process.exit(1);
}

const args = process.argv.slice(2);
const bi = args.indexOf("--baseline");
const baselineUpTo = bi >= 0 ? args[bi + 1] : null;
if (bi >= 0 && !/^\d{3}$/.test(baselineUpTo ?? "")) {
  console.error("Usage: node scripts/migrate.mjs --baseline 008");
  process.exit(1);
}

const migDir = join(root, "migrations");
const files = readdirSync(migDir).filter((f) => f.endsWith(".sql")).sort();

console.log("Database host:", new URL(url).hostname);

const sql = postgres(url, {
  ssl: process.env.DATABASE_SSL === "false" ? false : "require",
  prepare: false,
  max: 1,
  onnotice: () => {},
});

async function mark(db, name) {
  await db`INSERT INTO schema_migrations (name) VALUES (${name}) ON CONFLICT DO NOTHING`;
}

async function run() {
  await sql`CREATE TABLE IF NOT EXISTS schema_migrations (
    name TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;

  const [{ has }] =
    await sql`SELECT to_regclass('public.reservations') IS NOT NULL AS has`;
  const applied = new Set(
    (await sql`SELECT name FROM schema_migrations`).map((r) => r.name)
  );

  // ---- Baseline an existing database (no SQL from migrations is executed) ----
  if (baselineUpTo) {
    if (!has) {
      throw new Error("Empty database: run without --baseline.");
    }
    const cols = await sql`
      SELECT column_name FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'reservations'`;
    const have = new Set(cols.map((c) => c.column_name));
    const required = ["fait_a", "signing_token", "signing_token_2", "signer_2_name"];
    const missing = required.filter((c) => !have.has(c));
    if (missing.length) {
      throw new Error(
        `This database is behind (missing columns: ${missing.join(", ")}). ` +
          "Apply the missing migrations manually first, then baseline."
      );
    }
    const targets = files.filter((f) => f.slice(0, 3) <= baselineUpTo);
    for (const f of targets) await mark(sql, f);
    console.log(`Baselined ${targets.length} migration(s) up to ${baselineUpTo}. Nothing was executed.`);
    return;
  }

  // ---- Fresh, empty database ----
  if (!has) {
    console.log("Empty database: applying schema.sql");
    const schema = stripBom(readFileSync(join(root, "schema.sql"), "utf8"));
    await sql.begin(async (tx) => {
      await tx.unsafe(schema);
      for (const f of files) await mark(tx, f);
    });
    console.log(`Schema applied. ${files.length} migration(s) recorded as applied.`);
    return;
  }

  // ---- Existing database that was never tracked: refuse ----
  if (applied.size === 0) {
    throw new Error(
      "Existing database without migration history. " +
        "Back it up, then run: node scripts/migrate.mjs --baseline 008"
    );
  }

  // ---- Normal: apply pending migrations in order, one transaction each ----
  const pending = files.filter((f) => !applied.has(f));
  if (pending.length === 0) {
    console.log("Nothing to apply. Database is up to date.");
    return;
  }
  for (const f of pending) {
    const content = stripBom(readFileSync(join(migDir, f), "utf8"));
    console.log("Applying", f);
    await sql.begin(async (tx) => {
      await tx.unsafe(content);
      await mark(tx, f);
    });
  }
  console.log(`Applied ${pending.length} migration(s).`);
}

try {
  await run();
} catch (err) {
  console.error("FAILED:", err.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}