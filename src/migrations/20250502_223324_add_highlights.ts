import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "highlights" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"post_id_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "highlights_id" integer;
  DO $$ BEGIN
   ALTER TABLE "highlights" ADD CONSTRAINT "highlights_post_id_id_posts_id_fk" FOREIGN KEY ("post_id_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE UNIQUE INDEX IF NOT EXISTS "highlights_post_id_idx" ON "highlights" USING btree ("post_id_id");
  CREATE INDEX IF NOT EXISTS "highlights_updated_at_idx" ON "highlights" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "highlights_created_at_idx" ON "highlights" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_highlights_fk" FOREIGN KEY ("highlights_id") REFERENCES "public"."highlights"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_highlights_id_idx" ON "payload_locked_documents_rels" USING btree ("highlights_id");`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "highlights" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "highlights" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_highlights_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_highlights_id_idx";
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "display_image_url";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "highlights_id";`);
}
