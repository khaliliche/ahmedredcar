import { readFileSync, readdirSync } from "fs";
import { join } from "path";

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

function stripBom(text) {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

const dir = "migrations";
for (const file of readdirSync(dir).sort()) {
  console.log("Running", file);
  const content = stripBom(readFileSync(join(dir, file), "utf8"));
  await sql.unsafe(content);
}
console.log("Done.");
await sql.end();
