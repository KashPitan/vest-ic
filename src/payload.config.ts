import sharp from "sharp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { Posts } from "./collections/posts";
import { Media } from "./collections/media";

export default buildConfig({
  editor: lexicalEditor(),
  collections: [Posts, Media],
  secret: process.env.PAYLOAD_SECRET || "",
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    migrationDir: "./src/migrations",
  }),
  sharp,
  upload: {
    limits: {
      fileSize: 5000000, // 5MB, written in bytes
    }
  }
});
