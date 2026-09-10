import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import postgres from "postgres";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sql = postgres(process.env.DATABASE_URL);

const migrationPath = path.join(__dirname, "../migrations/003_pricing_tiers.sql");
const migrationSql = readFileSync(migrationPath, "utf8");

try {
  await sql.unsafe(migrationSql);
  console.log("✅ Pricing tiers migration applied.");
} catch (err) {
  console.error("❌ Migration failed:", err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
