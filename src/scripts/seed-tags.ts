import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { WebSocket } from "ws";
import * as schema from "../db/schema";
import tagData from "../data/tag-data.json";

// Set up Neon configuration
const connectionString = "REPLACE-ME";

if (!connectionString) {
  throw new Error("Database connection string not found");
}

if (process.env.NODE_ENV === "production") {
  neonConfig.webSocketConstructor = WebSocket;
  neonConfig.poolQueryViaFetch = true;
} else {
  neonConfig.wsProxy = (host) => `${host}:5433/v1`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

// Create database connection
const pool = new Pool({ connectionString });
const db = drizzle(pool, { schema });

async function seedTags() {
  try {
    console.log("Starting tag seeding...");

    // Flatten the data into a single array of tags
    const allTags = Object.entries(tagData).flatMap(([category, items]) =>
      items.map((item) => ({
        tagName: item.name,
        category: category as "Cat1" | "Cat2" | "Cat3" | "Cat4",
      })),
    );

    // Insert all tags
    const result = await db.insert(schema.tags).values(allTags).returning();

    console.log(`Successfully inserted ${result.length} tags`);
  } catch (error) {
    console.error("Error seeding tags:", error);
    process.exit(1);
  } finally {
    // Close the database connection
    await pool.end();
    process.exit(0);
  }
}

seedTags();
