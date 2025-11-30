import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "about_mobile_hero" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "sketchlogs" ALTER COLUMN "excerpt" SET DATA TYPE jsonb;
  ALTER TABLE "_sketchlogs_v" ALTER COLUMN "version_excerpt" SET DATA TYPE jsonb;
  ALTER TABLE "about_mobile_hero" ADD CONSTRAINT "about_mobile_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "about_mobile_hero_image_idx" ON "about_mobile_hero" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about_mobile_hero" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "about_mobile_hero" CASCADE;
  ALTER TABLE "sketchlogs" ALTER COLUMN "excerpt" SET DATA TYPE varchar;
  ALTER TABLE "_sketchlogs_v" ALTER COLUMN "version_excerpt" SET DATA TYPE varchar;`)
}
