// Applies schema.sql + migrations, then exits.
// Usage: node scripts/init-db.mjs   (set DATABASE_SSL=false to skip TLS).
import { readFileSync } from "fs";
import { readdirSync } from "fs";
import { join } from "path";

const raw = readFileSync(".env.local", "utf8");
const env = Object.fromEntries(
  raw
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const idx = l.indexOf("=");
      const key = l.slice(0, idx).trim();
      let val = l.slice(idx + 1).trim();
      val = val.replace(/^"|"$/g, "");
      return [key, val];
    })
);

process.env.DATABASE_URL = env.DATABASE_URL;

const { default: postgres } = await import("postgres");
const ssl = process.env.DATABASE_SSL === "false" ? false : "require";
const sql = postgres(process.env.DATABASE_URL, { ssl });

const schema = readFileSync("schema.sql", "utf8");
await sql.unsafe(schema);

// Then apply every migration, in order.
const migrationsDir = "migrations";
for (const file of readdirSync(migrationsDir).sort()) {
  const migration = readFileSync(join(migrationsDir, file), "utf8");
  await sql.unsafe(migration);
}

console.log("Database schema applied.");
await sql.end();