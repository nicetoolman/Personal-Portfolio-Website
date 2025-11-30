import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-vercel-postgres'

/**
 * 修复迁移：为 payload_locked_documents_rels 表添加 sketchlogs_id 列
 * 
 * 这个迁移是幂等的，可以安全地多次运行。
 * 它会检查列、外键约束和索引是否已存在，如果存在则跳过。
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. 添加 sketchlogs_id 列（如果不存在）
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'payload_locked_documents_rels'
        AND column_name = 'sketchlogs_id'
      ) THEN
        ALTER TABLE "payload_locked_documents_rels"
        ADD COLUMN "sketchlogs_id" integer;
      END IF;
    END $$;
  `)

  // 2. 添加外键约束（如果不存在且 sketchlogs 表存在）
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'sketchlogs'
      ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_schema = 'public'
        AND constraint_name = 'payload_locked_documents_rels_sketchlogs_fk'
      ) THEN
        ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_sketchlogs_fk"
        FOREIGN KEY ("sketchlogs_id") REFERENCES "sketchlogs"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;
  `)

  // 3. 添加索引（如果不存在）
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_sketchlogs_id_idx"
    ON "payload_locked_documents_rels" ("sketchlogs_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // 删除索引
  await db.execute(sql`
    DROP INDEX IF EXISTS "payload_locked_documents_rels_sketchlogs_id_idx";
  `)

  // 删除外键约束
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_schema = 'public'
        AND constraint_name = 'payload_locked_documents_rels_sketchlogs_fk'
      ) THEN
        ALTER TABLE "payload_locked_documents_rels"
        DROP CONSTRAINT "payload_locked_documents_rels_sketchlogs_fk";
      END IF;
    END $$;
  `)

  // 删除列
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'payload_locked_documents_rels'
        AND column_name = 'sketchlogs_id'
      ) THEN
        ALTER TABLE "payload_locked_documents_rels"
        DROP COLUMN "sketchlogs_id";
      END IF;
    END $$;
  `)
}

