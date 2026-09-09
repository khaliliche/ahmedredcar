import { readFileSync } from "fs";

const migrationPath = process.argv[2];
if (!migrationPath) {
  console.error("Usage: node scripts/run-migration.mjs <path-to-migration.sql>");
  process.exit(1);
}

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

if (!env.DATABASE_URL) {
  console.error("DATABASE_URL not found in .env.local");
  process.exit(1);
}

process.env.DATABASE_URL = env.DATABASE_URL;

const { default: postgres } = await import("postgres");
const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });

const url = new URL(env.DATABASE_URL);
console.log("Connected host:", url.hostname);
console.log("Applying migration:", migrationPath);

let migrationSql = readFileSync(migrationPath, "utf8");
migrationSql = migrationSql.replace(/^\uFEFF/, "");

try {
  await sql.unsafe(migrationSql);
  console.log("Migration applied successfully.");
} catch (err) {
  console.error("Migration failed:", err.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
