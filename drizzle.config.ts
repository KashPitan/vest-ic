import { defineConfig } from "drizzle-kit";

const url =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL_2
    : process.env.LOCAL_POSTGRES_URL;

if (!url)
  throw new Error(
    `Connection string to ${process.env.NODE_ENV ? "Neon" : "local"} Postgres not found.`,
  );

const url =
  process.env.NODE_ENV === "production"
    ? process.env.POSTGRES_URL
    : process.env.LOCAL_POSTGRES_URL;
if (!url)
  throw new Error(
    `Connection string to ${process.env.NODE_ENV ? "Neon" : "local"} Postgres not found.`,
  );
console.log("url", url);
export default defineConfig({
  schema: "./src/db/schema/*",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
  verbose: true,
});
