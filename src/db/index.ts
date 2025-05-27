import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Get the database URL from environment variables
const sql = neon(process.env.LOCAL_POSTGRES_URL!);
console.log('process.env.LOCAL_POSTGRES_URL', process.env.LOCAL_POSTGRES_URL);
console.log('sql', sql)
export const db = drizzle(sql, { schema });

// Export types
export type DbClient = typeof db;
