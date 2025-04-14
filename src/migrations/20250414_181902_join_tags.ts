import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "post_tags" ALTER COLUMN "post_id_id" DROP NOT NULL;
  ALTER TABLE "post_tags" ALTER COLUMN "tag_id_id" DROP NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "post_tags" ALTER COLUMN "post_id_id" SET NOT NULL;
  ALTER TABLE "post_tags" ALTER COLUMN "tag_id_id" SET NOT NULL;`)
}
