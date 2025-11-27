import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_projects_v_version_steps_images"
    ADD COLUMN "caption" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_projects_v_version_steps_images"
    DROP COLUMN IF EXISTS "caption";
  `)
}

