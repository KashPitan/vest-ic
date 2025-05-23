import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "post_tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"post_id_id" integer,
  	"tag_id_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "post_tags_id" integer;
  DO $$ BEGIN
   ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_id_posts_id_fk" FOREIGN KEY ("post_id_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tag_id_id_tags_id_fk" FOREIGN KEY ("tag_id_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "post_tags_post_id_idx" ON "post_tags" USING btree ("post_id_id");
  CREATE INDEX IF NOT EXISTS "post_tags_tag_id_idx" ON "post_tags" USING btree ("tag_id_id");
  CREATE INDEX IF NOT EXISTS "post_tags_updated_at_idx" ON "post_tags" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "post_tags_created_at_idx" ON "post_tags" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_post_tags_fk" FOREIGN KEY ("post_tags_id") REFERENCES "public"."post_tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_post_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("post_tags_id");`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "post_tags" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "post_tags" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_post_tags_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_post_tags_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "post_tags_id";`);
}
