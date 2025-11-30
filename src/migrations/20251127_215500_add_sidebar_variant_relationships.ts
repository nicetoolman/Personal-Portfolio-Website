import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "sidebarVariants" (
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
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'sidebarVariants_icon_fk'
      ) THEN
        ALTER TABLE "sidebarVariants"
        ADD CONSTRAINT "sidebarVariants_icon_fk"
        FOREIGN KEY ("icon_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "sidebarVariants_slug_idx" ON "sidebarVariants" ("slug");
  `)

  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
    ADD COLUMN IF NOT EXISTS "sidebar_variants_id" integer REFERENCES "sidebarVariants"("id") ON DELETE CASCADE;
  `)

  await db.execute(sql`
    ALTER TABLE "projects_steps"
    ADD COLUMN "sidebar_left_variant_id" integer REFERENCES "sidebarVariants"("id") ON DELETE SET NULL;
  `)

  await db.execute(sql`
    ALTER TABLE "projects_steps"
    ADD COLUMN "sidebar_right_variant_id" integer REFERENCES "sidebarVariants"("id") ON DELETE SET NULL;
  `)

  await db.execute(sql`
    ALTER TABLE "_projects_v_version_steps"
    ADD COLUMN "sidebar_left_variant_id" integer REFERENCES "sidebarVariants"("id") ON DELETE SET NULL;
  `)

  await db.execute(sql`
    ALTER TABLE "_projects_v_version_steps"
    ADD COLUMN "sidebar_right_variant_id" integer REFERENCES "sidebarVariants"("id") ON DELETE SET NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_projects_v_version_steps"
    DROP COLUMN IF EXISTS "sidebar_right_variant_id";
  `)

  await db.execute(sql`
    ALTER TABLE "_projects_v_version_steps"
    DROP COLUMN IF EXISTS "sidebar_left_variant_id";
  `)

  await db.execute(sql`
    ALTER TABLE "projects_steps"
    DROP COLUMN IF EXISTS "sidebar_right_variant_id";
  `)

  await db.execute(sql`
    ALTER TABLE "projects_steps"
    DROP COLUMN IF EXISTS "sidebar_left_variant_id";
  `)

  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
    DROP COLUMN IF EXISTS "sidebar_variants_id";
  `)

  await db.execute(sql`
    DROP TABLE IF EXISTS "sidebarVariants" CASCADE;
  `)
}

