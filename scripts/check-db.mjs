import { readFileSync } from "fs";

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

const url = new URL(env.DATABASE_URL);
console.log("Connected host:", url.hostname);

const { default: postgres } = await import("postgres");
const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });

const rows = await sql`
  SELECT column_name FROM information_schema.columns WHERE table_name = 'reservations'
`;
console.log("reservations columns:", rows.map(r => r.column_name));

await sql.end();