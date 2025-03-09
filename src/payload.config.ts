import sharp from "sharp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { Posts, Tags } from "./collections";

export default buildConfig({
  editor: lexicalEditor(),
  collections: [Posts, Tags],
  secret: process.env.PAYLOAD_SECRET || "",
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    migrationDir: "./src/migrations",
  }),
  sharp,
  admin: {
    importMap: {
      baseDir: "../../../../src",
    },
    components: {
      views: {
        "create-post": {
          Component: "/components/admin/CreatePost",
          path: "/create-post",
        },
      },
    },
  },
});
