import sharp from "sharp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { Posts } from "./collections/posts";
import { Media } from "./collections/media";

export default buildConfig({
  editor: lexicalEditor(),
  collections: [Posts, Media],
  plugins: [vercelBlobStorage({
    enabled: true,
    collections: {
      media: true
    },
    addRandomSuffix: true,
    token: process.env.BLOB_READ_WRITE_TOKEN
  })],
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
