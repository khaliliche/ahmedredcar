import { readFileSync } from "fs";

const raw = readFileSync(".env.local", "utf8");
const env = Object.fromEntries(
  raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i), l.slice(i + 1)];
    })
);

const { default: postgres } = await import("postgres");
const sql = postgres(env.DATABASE_URL, { ssl: "require" });

const result = await sql`DELETE FROM login_attempts`;
console.log("Deleted rows:", result.count);

await sql.end();
