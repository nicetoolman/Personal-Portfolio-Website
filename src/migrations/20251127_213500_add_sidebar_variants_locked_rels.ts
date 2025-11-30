import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "sidebarVariants" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "description" text,
      "icon_id" integer,
      "accent_color" varchar,
      "slug" varchar,
      "slug_lock" boolean DEFAULT true,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  await db.execute(sql`
    ALTER TABLE "sidebarVariants"
    ADD CONSTRAINT "sidebarVariants_icon_fk" FOREIGN KEY ("icon_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
  `)

  await db.execute(sql`
    CREATE INDEX "sidebarVariants_slug_idx" ON "sidebarVariants" ("slug");
  `)

  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
    ADD COLUMN "sidebar_variants_id" integer REFERENCES "sidebarVariants"("id") ON DELETE CASCADE;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
    DROP COLUMN IF EXISTS "sidebar_variants_id";
  `)

  await db.execute(sql`
    DROP TABLE IF EXISTS "sidebarVariants" CASCADE;
  `)
}

