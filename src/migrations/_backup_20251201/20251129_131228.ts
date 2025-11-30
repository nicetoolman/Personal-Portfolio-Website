import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Create types only if they don't exist (idempotent)
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_sketchlogs_status') THEN
        CREATE TYPE "public"."enum_sketchlogs_status" AS ENUM('draft', 'published');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__sketchlogs_v_version_status') THEN
        CREATE TYPE "public"."enum__sketchlogs_v_version_status" AS ENUM('draft', 'published');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_projects_intro_meta_links_link_type') THEN
        CREATE TYPE "public"."enum_projects_intro_meta_links_link_type" AS ENUM('reference', 'custom');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_projects_steps_variant') THEN
        CREATE TYPE "public"."enum_projects_steps_variant" AS ENUM('standard', 'imageRight', 'imageLeft');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_projects_nav_footer_back_to_list_type') THEN
        CREATE TYPE "public"."enum_projects_nav_footer_back_to_list_type" AS ENUM('reference', 'custom');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_projects_nav_footer_back_to_list_appearance') THEN
        CREATE TYPE "public"."enum_projects_nav_footer_back_to_list_appearance" AS ENUM('default', 'outline');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_projects_status') THEN
        CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__projects_v_version_intro_meta_links_link_type') THEN
        CREATE TYPE "public"."enum__projects_v_version_intro_meta_links_link_type" AS ENUM('reference', 'custom');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__projects_v_version_steps_variant') THEN
        CREATE TYPE "public"."enum__projects_v_version_steps_variant" AS ENUM('standard', 'imageRight', 'imageLeft');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__projects_v_version_nav_footer_back_to_list_type') THEN
        CREATE TYPE "public"."enum__projects_v_version_nav_footer_back_to_list_type" AS ENUM('reference', 'custom');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__projects_v_version_nav_footer_back_to_list_appearance') THEN
        CREATE TYPE "public"."enum__projects_v_version_nav_footer_back_to_list_appearance" AS ENUM('default', 'outline');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__projects_v_version_status') THEN
        CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_footer_explore_section_links_link_type') THEN
        CREATE TYPE "public"."enum_footer_explore_section_links_link_type" AS ENUM('reference', 'custom');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_footer_contact_section_social_links_platform') THEN
        CREATE TYPE "public"."enum_footer_contact_section_social_links_platform" AS ENUM('rednote', 'instagram', 'x', 'custom');
      END IF;
    END $$;
  `)
  
  // Add enum values only if they don't exist
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'customHomepage' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_pages_hero_type')
      ) THEN
        ALTER TYPE "public"."enum_pages_hero_type" ADD VALUE 'customHomepage';
      END IF;
      IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'customHomepage' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum__pages_v_version_hero_type')
      ) THEN
        ALTER TYPE "public"."enum__pages_v_version_hero_type" ADD VALUE 'customHomepage';
      END IF;
    END $$;
  `)
  
  await db.execute(sql`
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sketchbook_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "sketchbook_external_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "sketchbook" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" jsonb,
  	"cover_id" integer NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sketchbook_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "sketchlogs_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "sketchlogs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"published_on" timestamp(3) with time zone,
  	"excerpt" varchar,
  	"project_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_sketchlogs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_sketchlogs_v_version_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_sketchlogs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_published_on" timestamp(3) with time zone,
  	"version_excerpt" varchar,
  	"version_project_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__sketchlogs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "projects_intro_showcase_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "projects_intro_meta_roles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" varchar
  );
  
  CREATE TABLE "projects_intro_meta_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar
  );
  
  CREATE TABLE "projects_intro_meta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_projects_intro_meta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "projects_intro_meta_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag_id" integer
  );
  
  CREATE TABLE "projects_steps_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "projects_steps_sidebar_left_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "projects_steps_sidebar_right_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "projects_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_projects_steps_variant",
  	"title" varchar,
  	"subtitle" varchar,
  	"text1" jsonb,
  	"text1_divider" boolean,
  	"text2" jsonb,
  	"text3" jsonb,
  	"text4" jsonb,
  	"enable_sidebar_left" boolean,
  	"sidebar_left_variant_id" integer,
  	"sidebar_left_content" jsonb,
  	"enable_sidebar_right" boolean,
  	"sidebar_right_variant_id" integer,
  	"sidebar_right_content" jsonb
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"intro_title_group_title" jsonb,
  	"intro_title_group_subtitle" jsonb,
  	"intro_hero_image_id" integer,
  	"intro_content_overview" jsonb,
  	"intro_content_goal" jsonb,
  	"intro_content_process" jsonb,
  	"intro_content_outcome" jsonb,
  	"intro_meta_year" varchar,
  	"nav_footer_closing_image_id" integer,
  	"nav_footer_previous_project_id" integer,
  	"nav_footer_next_project_id" integer,
  	"nav_footer_back_to_list_type" "enum_projects_nav_footer_back_to_list_type" DEFAULT 'reference',
  	"nav_footer_back_to_list_new_tab" boolean,
  	"nav_footer_back_to_list_url" varchar,
  	"nav_footer_back_to_list_label" varchar,
  	"nav_footer_back_to_list_appearance" "enum_projects_nav_footer_back_to_list_appearance" DEFAULT 'default',
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "_projects_v_version_intro_showcase_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_intro_meta_roles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_intro_meta_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"keyword" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_intro_meta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__projects_v_version_intro_meta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_intro_meta_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_steps_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_steps_sidebar_left_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_steps_sidebar_right_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__projects_v_version_steps_variant",
  	"title" varchar,
  	"subtitle" varchar,
  	"text1" jsonb,
  	"text1_divider" boolean,
  	"text2" jsonb,
  	"text3" jsonb,
  	"text4" jsonb,
  	"enable_sidebar_left" boolean,
  	"sidebar_left_variant_id" integer,
  	"sidebar_left_content" jsonb,
  	"enable_sidebar_right" boolean,
  	"sidebar_right_variant_id" integer,
  	"sidebar_right_content" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_intro_title_group_title" jsonb,
  	"version_intro_title_group_subtitle" jsonb,
  	"version_intro_hero_image_id" integer,
  	"version_intro_content_overview" jsonb,
  	"version_intro_content_goal" jsonb,
  	"version_intro_content_process" jsonb,
  	"version_intro_content_outcome" jsonb,
  	"version_intro_meta_year" varchar,
  	"version_nav_footer_closing_image_id" integer,
  	"version_nav_footer_previous_project_id" integer,
  	"version_nav_footer_next_project_id" integer,
  	"version_nav_footer_back_to_list_type" "enum__projects_v_version_nav_footer_back_to_list_type" DEFAULT 'reference',
  	"version_nav_footer_back_to_list_new_tab" boolean,
  	"version_nav_footer_back_to_list_url" varchar,
  	"version_nav_footer_back_to_list_label" varchar,
  	"version_nav_footer_back_to_list_appearance" "enum__projects_v_version_nav_footer_back_to_list_appearance" DEFAULT 'default',
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "sidebar_variants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"icon_id" integer NOT NULL,
  	"accent_color" varchar,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "footer_explore_section_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_explore_section_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "footer_contact_section_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_footer_contact_section_social_links_platform" NOT NULL,
  	"icon_id" integer,
  	"url" varchar NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "about_page_decorations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_section_level3_id" integer,
  	"intro_section_level1_id" integer,
  	"intro_section_level4_id" integer,
  	"intro_section_level2_id" integer,
  	"intro_section_level5_1_id" integer,
  	"intro_section_level5_2_id" integer,
  	"decoration_section1_id" integer,
  	"decoration_section2_id" integer,
  	"decoration_section3_id" integer,
  	"resume_section_title_id" integer,
  	"resume_section_headline_id" integer,
  	"resume_section_basic_info_left_id" integer,
  	"resume_section_basic_info_background_id" integer,
  	"resume_section_basic_info_right_closed_id" integer,
  	"resume_section_basic_info_right_open_id" integer,
  	"resume_section_resume_intro_id" integer,
  	"resume_section_resume_grid_background_id" integer,
  	"resume_section_resume_grid_left_id" integer,
  	"resume_section_resume_grid_right_closed_id" integer,
  	"resume_section_resume_grid_right_open_id" integer,
  	"resume_section_resume_section5_id" integer,
  	"resume_section_resume_section6_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "project_page_intro" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title_image_id" integer,
  	"text_line1_id" integer,
  	"placeholder1_id" integer,
  	"placeholder2_id" integer,
  	"placeholder3_id" integer,
  	"placeholder4_id" integer,
  	"text_line2_id" integer,
  	"scroll_hint_id" integer,
  	"flow_cards_flow1_image_id" integer,
  	"flow_cards_flow1_text_image_id" integer,
  	"flow_cards_flow1_bottom_image_id" integer,
  	"flow_cards_flow2_image_id" integer,
  	"flow_cards_flow2_text_image_id" integer,
  	"flow_cards_flow2_bottom_image_id" integer,
  	"flow_cards_flow3_image_id" integer,
  	"flow_cards_flow3_text_image_id" integer,
  	"flow_cards_flow3_bottom_image_id" integer,
  	"flow_cards_flow4_image_id" integer,
  	"flow_cards_flow4_text_image_id" integer,
  	"flow_cards_flow4_bottom_image_id" integer,
  	"flow_cards_flow5_image_id" integer,
  	"flow_cards_flow5_text_image_id" integer,
  	"flow_cards_flow5_bottom_image_id" integer,
  	"flow_cards_flow6_image_id" integer,
  	"flow_cards_flow6_text_image_id" integer,
  	"flow_cards_flow6_bottom_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "project_detail_page_intro" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"scroll_hint_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages" ADD COLUMN "hero_main_visual_group_main_visual_id" integer;
  ALTER TABLE "pages" ADD COLUMN "hero_title_group_title_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "hero_scroll_bar_group_scroll_bar_id" integer;
  ALTER TABLE "pages" ADD COLUMN "hero_decoration_group_decoration_image_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_main_visual_group_main_visual_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_title_group_title_image_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_scroll_bar_group_scroll_bar_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_decoration_group_decoration_image_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tags_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "sketchbook_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "sketchlogs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "sidebar_variants_id" integer;
  ALTER TABLE "header" ADD COLUMN "logo_id" integer;
  ALTER TABLE "footer" ADD COLUMN "identity_section_title" varchar DEFAULT 'Identity';
  ALTER TABLE "footer" ADD COLUMN "identity_section_icon_id" integer;
  ALTER TABLE "footer" ADD COLUMN "identity_section_description" varchar DEFAULT 'Sketches, stories, and visual experiments by Ming Zu';
  ALTER TABLE "footer" ADD COLUMN "explore_section_title" varchar DEFAULT 'Explore';
  ALTER TABLE "footer" ADD COLUMN "contact_section_title" varchar DEFAULT 'Contact';
  ALTER TABLE "footer" ADD COLUMN "copyright" varchar DEFAULT '© 2025 Catbox Idea Factory. All rights reserved.';
  ALTER TABLE "sketchbook_images" ADD CONSTRAINT "sketchbook_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sketchbook_images" ADD CONSTRAINT "sketchbook_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sketchbook"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sketchbook_external_links" ADD CONSTRAINT "sketchbook_external_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sketchbook"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sketchbook" ADD CONSTRAINT "sketchbook_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sketchbook_rels" ADD CONSTRAINT "sketchbook_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."sketchbook"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sketchbook_rels" ADD CONSTRAINT "sketchbook_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sketchlogs_images" ADD CONSTRAINT "sketchlogs_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sketchlogs_images" ADD CONSTRAINT "sketchlogs_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sketchlogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sketchlogs" ADD CONSTRAINT "sketchlogs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sketchlogs_v_version_images" ADD CONSTRAINT "_sketchlogs_v_version_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sketchlogs_v_version_images" ADD CONSTRAINT "_sketchlogs_v_version_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_sketchlogs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_sketchlogs_v" ADD CONSTRAINT "_sketchlogs_v_parent_id_sketchlogs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."sketchlogs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sketchlogs_v" ADD CONSTRAINT "_sketchlogs_v_version_project_id_projects_id_fk" FOREIGN KEY ("version_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_intro_showcase_images" ADD CONSTRAINT "projects_intro_showcase_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_intro_showcase_images" ADD CONSTRAINT "projects_intro_showcase_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_intro_meta_roles" ADD CONSTRAINT "projects_intro_meta_roles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_intro_meta_keywords" ADD CONSTRAINT "projects_intro_meta_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_intro_meta_links" ADD CONSTRAINT "projects_intro_meta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_intro_meta_tags" ADD CONSTRAINT "projects_intro_meta_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_intro_meta_tags" ADD CONSTRAINT "projects_intro_meta_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_steps_images" ADD CONSTRAINT "projects_steps_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_steps_images" ADD CONSTRAINT "projects_steps_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_steps_sidebar_left_images" ADD CONSTRAINT "projects_steps_sidebar_left_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_steps_sidebar_left_images" ADD CONSTRAINT "projects_steps_sidebar_left_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_steps_sidebar_right_images" ADD CONSTRAINT "projects_steps_sidebar_right_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_steps_sidebar_right_images" ADD CONSTRAINT "projects_steps_sidebar_right_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_steps" ADD CONSTRAINT "projects_steps_sidebar_left_variant_id_sidebar_variants_id_fk" FOREIGN KEY ("sidebar_left_variant_id") REFERENCES "public"."sidebar_variants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_steps" ADD CONSTRAINT "projects_steps_sidebar_right_variant_id_sidebar_variants_id_fk" FOREIGN KEY ("sidebar_right_variant_id") REFERENCES "public"."sidebar_variants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_steps" ADD CONSTRAINT "projects_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_intro_hero_image_id_media_id_fk" FOREIGN KEY ("intro_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_nav_footer_closing_image_id_media_id_fk" FOREIGN KEY ("nav_footer_closing_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_nav_footer_previous_project_id_projects_id_fk" FOREIGN KEY ("nav_footer_previous_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_nav_footer_next_project_id_projects_id_fk" FOREIGN KEY ("nav_footer_next_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_intro_showcase_images" ADD CONSTRAINT "_projects_v_version_intro_showcase_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_intro_showcase_images" ADD CONSTRAINT "_projects_v_version_intro_showcase_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_intro_meta_roles" ADD CONSTRAINT "_projects_v_version_intro_meta_roles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_intro_meta_keywords" ADD CONSTRAINT "_projects_v_version_intro_meta_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_intro_meta_links" ADD CONSTRAINT "_projects_v_version_intro_meta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_intro_meta_tags" ADD CONSTRAINT "_projects_v_version_intro_meta_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_intro_meta_tags" ADD CONSTRAINT "_projects_v_version_intro_meta_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_steps_images" ADD CONSTRAINT "_projects_v_version_steps_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_steps_images" ADD CONSTRAINT "_projects_v_version_steps_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_steps_sidebar_left_images" ADD CONSTRAINT "_projects_v_version_steps_sidebar_left_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_steps_sidebar_left_images" ADD CONSTRAINT "_projects_v_version_steps_sidebar_left_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_steps_sidebar_right_images" ADD CONSTRAINT "_projects_v_version_steps_sidebar_right_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_steps_sidebar_right_images" ADD CONSTRAINT "_projects_v_version_steps_sidebar_right_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_steps" ADD CONSTRAINT "_projects_v_version_steps_sidebar_left_variant_id_sidebar_variants_id_fk" FOREIGN KEY ("sidebar_left_variant_id") REFERENCES "public"."sidebar_variants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_steps" ADD CONSTRAINT "_projects_v_version_steps_sidebar_right_variant_id_sidebar_variants_id_fk" FOREIGN KEY ("sidebar_right_variant_id") REFERENCES "public"."sidebar_variants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_steps" ADD CONSTRAINT "_projects_v_version_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_intro_hero_image_id_media_id_fk" FOREIGN KEY ("version_intro_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_nav_footer_closing_image_id_media_id_fk" FOREIGN KEY ("version_nav_footer_closing_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_nav_footer_previous_project_id_projects_id_fk" FOREIGN KEY ("version_nav_footer_previous_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_nav_footer_next_project_id_projects_id_fk" FOREIGN KEY ("version_nav_footer_next_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sidebar_variants" ADD CONSTRAINT "sidebar_variants_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_explore_section_links" ADD CONSTRAINT "footer_explore_section_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_contact_section_social_links" ADD CONSTRAINT "footer_contact_section_social_links_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_contact_section_social_links" ADD CONSTRAINT "footer_contact_section_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_decorations" ADD CONSTRAINT "about_page_decorations_intro_section_level3_id_media_id_fk" FOREIGN KEY ("intro_section_level3_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_decorations" ADD CONSTRAINT "about_page_decorations_intro_section_level1_id_media_id_fk" FOREIGN KEY ("intro_section_level1_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_decorations" ADD CONSTRAINT "about_page_decorations_intro_section_level4_id_media_id_fk" FOREIGN KEY ("intro_section_level4_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_decorations" ADD CONSTRAINT "about_page_decorations_intro_section_level2_id_media_id_fk" FOREIGN KEY ("intro_section_level2_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_decorations" ADD CONSTRAINT "about_page_decorations_intro_section_level5_1_id_media_id_fk" FOREIGN KEY ("intro_section_level5_1_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_decorations" ADD CONSTRAINT "about_page_decorations_intro_section_level5_2_id_media_id_fk" FOREIGN KEY ("intro_section_level5_2_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_decorations" ADD CONSTRAINT "about_page_decorations_decoration_section1_id_media_id_fk" FOREIGN KEY ("decoration_section1_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_decorations" ADD CONSTRAINT "about_page_decorations_decoration_section2_id_media_id_fk" FOREIGN KEY ("decoration_section2_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_decorations" ADD CONSTRAINT "about_page_decorations_decoration_section3_id_media_id_fk" FOREIGN KEY ("decoration_section3_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_decorations" ADD CONSTRAINT "about_page_decorations_resume_section_title_id_media_id_fk" FOREIGN KEY ("resume_section_title_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_decorations" ADD CONSTRAINT "about_page_decorations_resume_section_headline_id_media_id_fk" FOREIGN KEY ("resume_section_headline_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_decorations" ADD CONSTRAINT "about_page_decorations_resume_section_basic_info_left_id_media_id_fk" FOREIGN KEY ("resume_section_basic_info_left_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_decorations" ADD CONSTRAINT "about_page_decorations_resume_section_basic_info_background_id_media_id_fk" FOREIGN KEY ("resume_section_basic_info_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_decorations" ADD CONSTRAINT "about_page_decorations_resume_section_basic_info_right_closed_id_media_id_fk" FOREIGN KEY ("resume_section_basic_info_right_closed_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_decorations" ADD CONSTRAINT "about_page_decorations_resume_section_basic_info_right_open_id_media_id_fk" FOREIGN KEY ("resume_section_basic_info_right_open_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_decorations" ADD CONSTRAINT "about_page_decorations_resume_section_resume_intro_id_media_id_fk" FOREIGN KEY ("resume_section_resume_intro_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_decorations" ADD CONSTRAINT "about_page_decorations_resume_section_resume_grid_background_id_media_id_fk" FOREIGN KEY ("resume_section_resume_grid_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_decorations" ADD CONSTRAINT "about_page_decorations_resume_section_resume_grid_left_id_media_id_fk" FOREIGN KEY ("resume_section_resume_grid_left_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_decorations" ADD CONSTRAINT "about_page_decorations_resume_section_resume_grid_right_closed_id_media_id_fk" FOREIGN KEY ("resume_section_resume_grid_right_closed_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_decorations" ADD CONSTRAINT "about_page_decorations_resume_section_resume_grid_right_open_id_media_id_fk" FOREIGN KEY ("resume_section_resume_grid_right_open_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_decorations" ADD CONSTRAINT "about_page_decorations_resume_section_resume_section5_id_media_id_fk" FOREIGN KEY ("resume_section_resume_section5_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_decorations" ADD CONSTRAINT "about_page_decorations_resume_section_resume_section6_id_media_id_fk" FOREIGN KEY ("resume_section_resume_section6_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_title_image_id_media_id_fk" FOREIGN KEY ("title_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_text_line1_id_media_id_fk" FOREIGN KEY ("text_line1_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_placeholder1_id_media_id_fk" FOREIGN KEY ("placeholder1_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_placeholder2_id_media_id_fk" FOREIGN KEY ("placeholder2_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_placeholder3_id_media_id_fk" FOREIGN KEY ("placeholder3_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_placeholder4_id_media_id_fk" FOREIGN KEY ("placeholder4_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_text_line2_id_media_id_fk" FOREIGN KEY ("text_line2_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_scroll_hint_id_media_id_fk" FOREIGN KEY ("scroll_hint_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_flow_cards_flow1_image_id_media_id_fk" FOREIGN KEY ("flow_cards_flow1_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_flow_cards_flow1_text_image_id_media_id_fk" FOREIGN KEY ("flow_cards_flow1_text_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_flow_cards_flow1_bottom_image_id_media_id_fk" FOREIGN KEY ("flow_cards_flow1_bottom_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_flow_cards_flow2_image_id_media_id_fk" FOREIGN KEY ("flow_cards_flow2_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_flow_cards_flow2_text_image_id_media_id_fk" FOREIGN KEY ("flow_cards_flow2_text_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_flow_cards_flow2_bottom_image_id_media_id_fk" FOREIGN KEY ("flow_cards_flow2_bottom_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_flow_cards_flow3_image_id_media_id_fk" FOREIGN KEY ("flow_cards_flow3_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_flow_cards_flow3_text_image_id_media_id_fk" FOREIGN KEY ("flow_cards_flow3_text_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_flow_cards_flow3_bottom_image_id_media_id_fk" FOREIGN KEY ("flow_cards_flow3_bottom_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_flow_cards_flow4_image_id_media_id_fk" FOREIGN KEY ("flow_cards_flow4_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_flow_cards_flow4_text_image_id_media_id_fk" FOREIGN KEY ("flow_cards_flow4_text_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_flow_cards_flow4_bottom_image_id_media_id_fk" FOREIGN KEY ("flow_cards_flow4_bottom_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_flow_cards_flow5_image_id_media_id_fk" FOREIGN KEY ("flow_cards_flow5_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_flow_cards_flow5_text_image_id_media_id_fk" FOREIGN KEY ("flow_cards_flow5_text_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_flow_cards_flow5_bottom_image_id_media_id_fk" FOREIGN KEY ("flow_cards_flow5_bottom_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_flow_cards_flow6_image_id_media_id_fk" FOREIGN KEY ("flow_cards_flow6_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_flow_cards_flow6_text_image_id_media_id_fk" FOREIGN KEY ("flow_cards_flow6_text_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_page_intro" ADD CONSTRAINT "project_page_intro_flow_cards_flow6_bottom_image_id_media_id_fk" FOREIGN KEY ("flow_cards_flow6_bottom_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_detail_page_intro" ADD CONSTRAINT "project_detail_page_intro_scroll_hint_image_id_media_id_fk" FOREIGN KEY ("scroll_hint_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "tags_title_idx" ON "tags" USING btree ("title");
  CREATE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "sketchbook_images_order_idx" ON "sketchbook_images" USING btree ("_order");
  CREATE INDEX "sketchbook_images_parent_id_idx" ON "sketchbook_images" USING btree ("_parent_id");
  CREATE INDEX "sketchbook_images_image_idx" ON "sketchbook_images" USING btree ("image_id");
  CREATE INDEX "sketchbook_external_links_order_idx" ON "sketchbook_external_links" USING btree ("_order");
  CREATE INDEX "sketchbook_external_links_parent_id_idx" ON "sketchbook_external_links" USING btree ("_parent_id");
  CREATE INDEX "sketchbook_cover_idx" ON "sketchbook" USING btree ("cover_id");
  CREATE INDEX "sketchbook_slug_idx" ON "sketchbook" USING btree ("slug");
  CREATE INDEX "sketchbook_updated_at_idx" ON "sketchbook" USING btree ("updated_at");
  CREATE INDEX "sketchbook_created_at_idx" ON "sketchbook" USING btree ("created_at");
  CREATE INDEX "sketchbook_rels_order_idx" ON "sketchbook_rels" USING btree ("order");
  CREATE INDEX "sketchbook_rels_parent_idx" ON "sketchbook_rels" USING btree ("parent_id");
  CREATE INDEX "sketchbook_rels_path_idx" ON "sketchbook_rels" USING btree ("path");
  CREATE INDEX "sketchbook_rels_tags_id_idx" ON "sketchbook_rels" USING btree ("tags_id");
  CREATE INDEX "sketchlogs_images_order_idx" ON "sketchlogs_images" USING btree ("_order");
  CREATE INDEX "sketchlogs_images_parent_id_idx" ON "sketchlogs_images" USING btree ("_parent_id");
  CREATE INDEX "sketchlogs_images_image_idx" ON "sketchlogs_images" USING btree ("image_id");
  CREATE INDEX "sketchlogs_project_idx" ON "sketchlogs" USING btree ("project_id");
  CREATE INDEX "sketchlogs_updated_at_idx" ON "sketchlogs" USING btree ("updated_at");
  CREATE INDEX "sketchlogs_created_at_idx" ON "sketchlogs" USING btree ("created_at");
  CREATE INDEX "sketchlogs__status_idx" ON "sketchlogs" USING btree ("_status");
  CREATE INDEX "_sketchlogs_v_version_images_order_idx" ON "_sketchlogs_v_version_images" USING btree ("_order");
  CREATE INDEX "_sketchlogs_v_version_images_parent_id_idx" ON "_sketchlogs_v_version_images" USING btree ("_parent_id");
  CREATE INDEX "_sketchlogs_v_version_images_image_idx" ON "_sketchlogs_v_version_images" USING btree ("image_id");
  CREATE INDEX "_sketchlogs_v_parent_idx" ON "_sketchlogs_v" USING btree ("parent_id");
  CREATE INDEX "_sketchlogs_v_version_version_project_idx" ON "_sketchlogs_v" USING btree ("version_project_id");
  CREATE INDEX "_sketchlogs_v_version_version_updated_at_idx" ON "_sketchlogs_v" USING btree ("version_updated_at");
  CREATE INDEX "_sketchlogs_v_version_version_created_at_idx" ON "_sketchlogs_v" USING btree ("version_created_at");
  CREATE INDEX "_sketchlogs_v_version_version__status_idx" ON "_sketchlogs_v" USING btree ("version__status");
  CREATE INDEX "_sketchlogs_v_created_at_idx" ON "_sketchlogs_v" USING btree ("created_at");
  CREATE INDEX "_sketchlogs_v_updated_at_idx" ON "_sketchlogs_v" USING btree ("updated_at");
  CREATE INDEX "_sketchlogs_v_latest_idx" ON "_sketchlogs_v" USING btree ("latest");
  CREATE INDEX "projects_intro_showcase_images_order_idx" ON "projects_intro_showcase_images" USING btree ("_order");
  CREATE INDEX "projects_intro_showcase_images_parent_id_idx" ON "projects_intro_showcase_images" USING btree ("_parent_id");
  CREATE INDEX "projects_intro_showcase_images_image_idx" ON "projects_intro_showcase_images" USING btree ("image_id");
  CREATE INDEX "projects_intro_meta_roles_order_idx" ON "projects_intro_meta_roles" USING btree ("_order");
  CREATE INDEX "projects_intro_meta_roles_parent_id_idx" ON "projects_intro_meta_roles" USING btree ("_parent_id");
  CREATE INDEX "projects_intro_meta_keywords_order_idx" ON "projects_intro_meta_keywords" USING btree ("_order");
  CREATE INDEX "projects_intro_meta_keywords_parent_id_idx" ON "projects_intro_meta_keywords" USING btree ("_parent_id");
  CREATE INDEX "projects_intro_meta_links_order_idx" ON "projects_intro_meta_links" USING btree ("_order");
  CREATE INDEX "projects_intro_meta_links_parent_id_idx" ON "projects_intro_meta_links" USING btree ("_parent_id");
  CREATE INDEX "projects_intro_meta_tags_order_idx" ON "projects_intro_meta_tags" USING btree ("_order");
  CREATE INDEX "projects_intro_meta_tags_parent_id_idx" ON "projects_intro_meta_tags" USING btree ("_parent_id");
  CREATE INDEX "projects_intro_meta_tags_tag_idx" ON "projects_intro_meta_tags" USING btree ("tag_id");
  CREATE INDEX "projects_steps_images_order_idx" ON "projects_steps_images" USING btree ("_order");
  CREATE INDEX "projects_steps_images_parent_id_idx" ON "projects_steps_images" USING btree ("_parent_id");
  CREATE INDEX "projects_steps_images_image_idx" ON "projects_steps_images" USING btree ("image_id");
  CREATE INDEX "projects_steps_sidebar_left_images_order_idx" ON "projects_steps_sidebar_left_images" USING btree ("_order");
  CREATE INDEX "projects_steps_sidebar_left_images_parent_id_idx" ON "projects_steps_sidebar_left_images" USING btree ("_parent_id");
  CREATE INDEX "projects_steps_sidebar_left_images_image_idx" ON "projects_steps_sidebar_left_images" USING btree ("image_id");
  CREATE INDEX "projects_steps_sidebar_right_images_order_idx" ON "projects_steps_sidebar_right_images" USING btree ("_order");
  CREATE INDEX "projects_steps_sidebar_right_images_parent_id_idx" ON "projects_steps_sidebar_right_images" USING btree ("_parent_id");
  CREATE INDEX "projects_steps_sidebar_right_images_image_idx" ON "projects_steps_sidebar_right_images" USING btree ("image_id");
  CREATE INDEX "projects_steps_order_idx" ON "projects_steps" USING btree ("_order");
  CREATE INDEX "projects_steps_parent_id_idx" ON "projects_steps" USING btree ("_parent_id");
  CREATE INDEX "projects_steps_sidebar_left_sidebar_left_variant_idx" ON "projects_steps" USING btree ("sidebar_left_variant_id");
  CREATE INDEX "projects_steps_sidebar_right_sidebar_right_variant_idx" ON "projects_steps" USING btree ("sidebar_right_variant_id");
  CREATE INDEX "projects_intro_intro_hero_image_idx" ON "projects" USING btree ("intro_hero_image_id");
  CREATE INDEX "projects_nav_footer_nav_footer_closing_image_idx" ON "projects" USING btree ("nav_footer_closing_image_id");
  CREATE INDEX "projects_nav_footer_nav_footer_previous_project_idx" ON "projects" USING btree ("nav_footer_previous_project_id");
  CREATE INDEX "projects_nav_footer_nav_footer_next_project_idx" ON "projects" USING btree ("nav_footer_next_project_id");
  CREATE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_pages_id_idx" ON "projects_rels" USING btree ("pages_id");
  CREATE INDEX "projects_rels_posts_id_idx" ON "projects_rels" USING btree ("posts_id");
  CREATE INDEX "_projects_v_version_intro_showcase_images_order_idx" ON "_projects_v_version_intro_showcase_images" USING btree ("_order");
  CREATE INDEX "_projects_v_version_intro_showcase_images_parent_id_idx" ON "_projects_v_version_intro_showcase_images" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_intro_showcase_images_image_idx" ON "_projects_v_version_intro_showcase_images" USING btree ("image_id");
  CREATE INDEX "_projects_v_version_intro_meta_roles_order_idx" ON "_projects_v_version_intro_meta_roles" USING btree ("_order");
  CREATE INDEX "_projects_v_version_intro_meta_roles_parent_id_idx" ON "_projects_v_version_intro_meta_roles" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_intro_meta_keywords_order_idx" ON "_projects_v_version_intro_meta_keywords" USING btree ("_order");
  CREATE INDEX "_projects_v_version_intro_meta_keywords_parent_id_idx" ON "_projects_v_version_intro_meta_keywords" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_intro_meta_links_order_idx" ON "_projects_v_version_intro_meta_links" USING btree ("_order");
  CREATE INDEX "_projects_v_version_intro_meta_links_parent_id_idx" ON "_projects_v_version_intro_meta_links" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_intro_meta_tags_order_idx" ON "_projects_v_version_intro_meta_tags" USING btree ("_order");
  CREATE INDEX "_projects_v_version_intro_meta_tags_parent_id_idx" ON "_projects_v_version_intro_meta_tags" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_intro_meta_tags_tag_idx" ON "_projects_v_version_intro_meta_tags" USING btree ("tag_id");
  CREATE INDEX "_projects_v_version_steps_images_order_idx" ON "_projects_v_version_steps_images" USING btree ("_order");
  CREATE INDEX "_projects_v_version_steps_images_parent_id_idx" ON "_projects_v_version_steps_images" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_steps_images_image_idx" ON "_projects_v_version_steps_images" USING btree ("image_id");
  CREATE INDEX "_projects_v_version_steps_sidebar_left_images_order_idx" ON "_projects_v_version_steps_sidebar_left_images" USING btree ("_order");
  CREATE INDEX "_projects_v_version_steps_sidebar_left_images_parent_id_idx" ON "_projects_v_version_steps_sidebar_left_images" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_steps_sidebar_left_images_image_idx" ON "_projects_v_version_steps_sidebar_left_images" USING btree ("image_id");
  CREATE INDEX "_projects_v_version_steps_sidebar_right_images_order_idx" ON "_projects_v_version_steps_sidebar_right_images" USING btree ("_order");
  CREATE INDEX "_projects_v_version_steps_sidebar_right_images_parent_id_idx" ON "_projects_v_version_steps_sidebar_right_images" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_steps_sidebar_right_images_image_idx" ON "_projects_v_version_steps_sidebar_right_images" USING btree ("image_id");
  CREATE INDEX "_projects_v_version_steps_order_idx" ON "_projects_v_version_steps" USING btree ("_order");
  CREATE INDEX "_projects_v_version_steps_parent_id_idx" ON "_projects_v_version_steps" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_steps_sidebar_left_sidebar_left_variant_idx" ON "_projects_v_version_steps" USING btree ("sidebar_left_variant_id");
  CREATE INDEX "_projects_v_version_steps_sidebar_right_sidebar_right_variant_idx" ON "_projects_v_version_steps" USING btree ("sidebar_right_variant_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_intro_version_intro_hero_image_idx" ON "_projects_v" USING btree ("version_intro_hero_image_id");
  CREATE INDEX "_projects_v_version_nav_footer_version_nav_footer_closing_image_idx" ON "_projects_v" USING btree ("version_nav_footer_closing_image_id");
  CREATE INDEX "_projects_v_version_nav_footer_version_nav_footer_previous_project_idx" ON "_projects_v" USING btree ("version_nav_footer_previous_project_id");
  CREATE INDEX "_projects_v_version_nav_footer_version_nav_footer_next_project_idx" ON "_projects_v" USING btree ("version_nav_footer_next_project_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_rels_order_idx" ON "_projects_v_rels" USING btree ("order");
  CREATE INDEX "_projects_v_rels_parent_idx" ON "_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projects_v_rels_path_idx" ON "_projects_v_rels" USING btree ("path");
  CREATE INDEX "_projects_v_rels_pages_id_idx" ON "_projects_v_rels" USING btree ("pages_id");
  CREATE INDEX "_projects_v_rels_posts_id_idx" ON "_projects_v_rels" USING btree ("posts_id");
  CREATE INDEX "sidebar_variants_icon_idx" ON "sidebar_variants" USING btree ("icon_id");
  CREATE INDEX "sidebar_variants_slug_idx" ON "sidebar_variants" USING btree ("slug");
  CREATE INDEX "sidebar_variants_updated_at_idx" ON "sidebar_variants" USING btree ("updated_at");
  CREATE INDEX "sidebar_variants_created_at_idx" ON "sidebar_variants" USING btree ("created_at");
  CREATE INDEX "footer_explore_section_links_order_idx" ON "footer_explore_section_links" USING btree ("_order");
  CREATE INDEX "footer_explore_section_links_parent_id_idx" ON "footer_explore_section_links" USING btree ("_parent_id");
  CREATE INDEX "footer_contact_section_social_links_order_idx" ON "footer_contact_section_social_links" USING btree ("_order");
  CREATE INDEX "footer_contact_section_social_links_parent_id_idx" ON "footer_contact_section_social_links" USING btree ("_parent_id");
  CREATE INDEX "footer_contact_section_social_links_icon_idx" ON "footer_contact_section_social_links" USING btree ("icon_id");
  CREATE INDEX "about_page_decorations_intro_section_intro_section_level3_idx" ON "about_page_decorations" USING btree ("intro_section_level3_id");
  CREATE INDEX "about_page_decorations_intro_section_intro_section_level1_idx" ON "about_page_decorations" USING btree ("intro_section_level1_id");
  CREATE INDEX "about_page_decorations_intro_section_intro_section_level4_idx" ON "about_page_decorations" USING btree ("intro_section_level4_id");
  CREATE INDEX "about_page_decorations_intro_section_intro_section_level2_idx" ON "about_page_decorations" USING btree ("intro_section_level2_id");
  CREATE INDEX "about_page_decorations_intro_section_intro_section_level5_1_idx" ON "about_page_decorations" USING btree ("intro_section_level5_1_id");
  CREATE INDEX "about_page_decorations_intro_section_intro_section_level5_2_idx" ON "about_page_decorations" USING btree ("intro_section_level5_2_id");
  CREATE INDEX "about_page_decorations_decoration_section1_idx" ON "about_page_decorations" USING btree ("decoration_section1_id");
  CREATE INDEX "about_page_decorations_decoration_section2_idx" ON "about_page_decorations" USING btree ("decoration_section2_id");
  CREATE INDEX "about_page_decorations_decoration_section3_idx" ON "about_page_decorations" USING btree ("decoration_section3_id");
  CREATE INDEX "about_page_decorations_resume_section_resume_section_title_idx" ON "about_page_decorations" USING btree ("resume_section_title_id");
  CREATE INDEX "about_page_decorations_resume_section_resume_section_headline_idx" ON "about_page_decorations" USING btree ("resume_section_headline_id");
  CREATE INDEX "about_page_decorations_resume_section_resume_section_basic_info_left_idx" ON "about_page_decorations" USING btree ("resume_section_basic_info_left_id");
  CREATE INDEX "about_page_decorations_resume_section_resume_section_basic_info_background_idx" ON "about_page_decorations" USING btree ("resume_section_basic_info_background_id");
  CREATE INDEX "about_page_decorations_resume_section_resume_section_basic_info_right_closed_idx" ON "about_page_decorations" USING btree ("resume_section_basic_info_right_closed_id");
  CREATE INDEX "about_page_decorations_resume_section_resume_section_basic_info_right_open_idx" ON "about_page_decorations" USING btree ("resume_section_basic_info_right_open_id");
  CREATE INDEX "about_page_decorations_resume_section_resume_section_resume_intro_idx" ON "about_page_decorations" USING btree ("resume_section_resume_intro_id");
  CREATE INDEX "about_page_decorations_resume_section_resume_section_resume_grid_background_idx" ON "about_page_decorations" USING btree ("resume_section_resume_grid_background_id");
  CREATE INDEX "about_page_decorations_resume_section_resume_section_resume_grid_left_idx" ON "about_page_decorations" USING btree ("resume_section_resume_grid_left_id");
  CREATE INDEX "about_page_decorations_resume_section_resume_section_resume_grid_right_closed_idx" ON "about_page_decorations" USING btree ("resume_section_resume_grid_right_closed_id");
  CREATE INDEX "about_page_decorations_resume_section_resume_section_resume_grid_right_open_idx" ON "about_page_decorations" USING btree ("resume_section_resume_grid_right_open_id");
  CREATE INDEX "about_page_decorations_resume_section_resume_section_resume_section5_idx" ON "about_page_decorations" USING btree ("resume_section_resume_section5_id");
  CREATE INDEX "about_page_decorations_resume_section_resume_section_resume_section6_idx" ON "about_page_decorations" USING btree ("resume_section_resume_section6_id");
  CREATE INDEX "project_page_intro_title_image_idx" ON "project_page_intro" USING btree ("title_image_id");
  CREATE INDEX "project_page_intro_text_line1_idx" ON "project_page_intro" USING btree ("text_line1_id");
  CREATE INDEX "project_page_intro_placeholder1_idx" ON "project_page_intro" USING btree ("placeholder1_id");
  CREATE INDEX "project_page_intro_placeholder2_idx" ON "project_page_intro" USING btree ("placeholder2_id");
  CREATE INDEX "project_page_intro_placeholder3_idx" ON "project_page_intro" USING btree ("placeholder3_id");
  CREATE INDEX "project_page_intro_placeholder4_idx" ON "project_page_intro" USING btree ("placeholder4_id");
  CREATE INDEX "project_page_intro_text_line2_idx" ON "project_page_intro" USING btree ("text_line2_id");
  CREATE INDEX "project_page_intro_scroll_hint_idx" ON "project_page_intro" USING btree ("scroll_hint_id");
  CREATE INDEX "project_page_intro_flow_cards_flow1_flow_cards_flow1_image_idx" ON "project_page_intro" USING btree ("flow_cards_flow1_image_id");
  CREATE INDEX "project_page_intro_flow_cards_flow1_flow_cards_flow1_text_image_idx" ON "project_page_intro" USING btree ("flow_cards_flow1_text_image_id");
  CREATE INDEX "project_page_intro_flow_cards_flow1_flow_cards_flow1_bottom_image_idx" ON "project_page_intro" USING btree ("flow_cards_flow1_bottom_image_id");
  CREATE INDEX "project_page_intro_flow_cards_flow2_flow_cards_flow2_image_idx" ON "project_page_intro" USING btree ("flow_cards_flow2_image_id");
  CREATE INDEX "project_page_intro_flow_cards_flow2_flow_cards_flow2_text_image_idx" ON "project_page_intro" USING btree ("flow_cards_flow2_text_image_id");
  CREATE INDEX "project_page_intro_flow_cards_flow2_flow_cards_flow2_bottom_image_idx" ON "project_page_intro" USING btree ("flow_cards_flow2_bottom_image_id");
  CREATE INDEX "project_page_intro_flow_cards_flow3_flow_cards_flow3_image_idx" ON "project_page_intro" USING btree ("flow_cards_flow3_image_id");
  CREATE INDEX "project_page_intro_flow_cards_flow3_flow_cards_flow3_text_image_idx" ON "project_page_intro" USING btree ("flow_cards_flow3_text_image_id");
  CREATE INDEX "project_page_intro_flow_cards_flow3_flow_cards_flow3_bottom_image_idx" ON "project_page_intro" USING btree ("flow_cards_flow3_bottom_image_id");
  CREATE INDEX "project_page_intro_flow_cards_flow4_flow_cards_flow4_image_idx" ON "project_page_intro" USING btree ("flow_cards_flow4_image_id");
  CREATE INDEX "project_page_intro_flow_cards_flow4_flow_cards_flow4_text_image_idx" ON "project_page_intro" USING btree ("flow_cards_flow4_text_image_id");
  CREATE INDEX "project_page_intro_flow_cards_flow4_flow_cards_flow4_bottom_image_idx" ON "project_page_intro" USING btree ("flow_cards_flow4_bottom_image_id");
  CREATE INDEX "project_page_intro_flow_cards_flow5_flow_cards_flow5_image_idx" ON "project_page_intro" USING btree ("flow_cards_flow5_image_id");
  CREATE INDEX "project_page_intro_flow_cards_flow5_flow_cards_flow5_text_image_idx" ON "project_page_intro" USING btree ("flow_cards_flow5_text_image_id");
  CREATE INDEX "project_page_intro_flow_cards_flow5_flow_cards_flow5_bottom_image_idx" ON "project_page_intro" USING btree ("flow_cards_flow5_bottom_image_id");
  CREATE INDEX "project_page_intro_flow_cards_flow6_flow_cards_flow6_image_idx" ON "project_page_intro" USING btree ("flow_cards_flow6_image_id");
  CREATE INDEX "project_page_intro_flow_cards_flow6_flow_cards_flow6_text_image_idx" ON "project_page_intro" USING btree ("flow_cards_flow6_text_image_id");
  CREATE INDEX "project_page_intro_flow_cards_flow6_flow_cards_flow6_bottom_image_idx" ON "project_page_intro" USING btree ("flow_cards_flow6_bottom_image_id");
  CREATE INDEX "project_detail_page_intro_scroll_hint_image_idx" ON "project_detail_page_intro" USING btree ("scroll_hint_image_id");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_main_visual_group_main_visual_id_media_id_fk" FOREIGN KEY ("hero_main_visual_group_main_visual_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_title_group_title_image_id_media_id_fk" FOREIGN KEY ("hero_title_group_title_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_scroll_bar_group_scroll_bar_id_media_id_fk" FOREIGN KEY ("hero_scroll_bar_group_scroll_bar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_decoration_group_decoration_image_id_media_id_fk" FOREIGN KEY ("hero_decoration_group_decoration_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_main_visual_group_main_visual_id_media_id_fk" FOREIGN KEY ("version_hero_main_visual_group_main_visual_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_title_group_title_image_id_media_id_fk" FOREIGN KEY ("version_hero_title_group_title_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_scroll_bar_group_scroll_bar_id_media_id_fk" FOREIGN KEY ("version_hero_scroll_bar_group_scroll_bar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_decoration_group_decoration_image_id_media_id_fk" FOREIGN KEY ("version_hero_decoration_group_decoration_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sketchbook_fk" FOREIGN KEY ("sketchbook_id") REFERENCES "public"."sketchbook"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sketchlogs_fk" FOREIGN KEY ("sketchlogs_id") REFERENCES "public"."sketchlogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sidebar_variants_fk" FOREIGN KEY ("sidebar_variants_id") REFERENCES "public"."sidebar_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header" ADD CONSTRAINT "header_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_identity_section_icon_id_media_id_fk" FOREIGN KEY ("identity_section_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_hero_main_visual_group_hero_main_visual_group_main_visual_idx" ON "pages" USING btree ("hero_main_visual_group_main_visual_id");
  CREATE INDEX "pages_hero_title_group_hero_title_group_title_image_idx" ON "pages" USING btree ("hero_title_group_title_image_id");
  CREATE INDEX "pages_hero_scroll_bar_group_hero_scroll_bar_group_scroll_bar_idx" ON "pages" USING btree ("hero_scroll_bar_group_scroll_bar_id");
  CREATE INDEX "pages_hero_decoration_group_hero_decoration_group_decoration_image_idx" ON "pages" USING btree ("hero_decoration_group_decoration_image_id");
  CREATE INDEX "_pages_v_version_hero_main_visual_group_version_hero_main_visual_group_main_visual_idx" ON "_pages_v" USING btree ("version_hero_main_visual_group_main_visual_id");
  CREATE INDEX "_pages_v_version_hero_title_group_version_hero_title_group_title_image_idx" ON "_pages_v" USING btree ("version_hero_title_group_title_image_id");
  CREATE INDEX "_pages_v_version_hero_scroll_bar_group_version_hero_scroll_bar_group_scroll_bar_idx" ON "_pages_v" USING btree ("version_hero_scroll_bar_group_scroll_bar_id");
  CREATE INDEX "_pages_v_version_hero_decoration_group_version_hero_decoration_group_decoration_image_idx" ON "_pages_v" USING btree ("version_hero_decoration_group_decoration_image_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_sketchbook_id_idx" ON "payload_locked_documents_rels" USING btree ("sketchbook_id");
  CREATE INDEX "payload_locked_documents_rels_sketchlogs_id_idx" ON "payload_locked_documents_rels" USING btree ("sketchlogs_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_sidebar_variants_id_idx" ON "payload_locked_documents_rels" USING btree ("sidebar_variants_id");
  CREATE INDEX "header_logo_idx" ON "header" USING btree ("logo_id");
  CREATE INDEX "footer_identity_section_identity_section_icon_idx" ON "footer" USING btree ("identity_section_icon_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sketchbook_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sketchbook_external_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sketchbook" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sketchbook_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sketchlogs_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sketchlogs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_sketchlogs_v_version_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_sketchlogs_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_intro_showcase_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_intro_meta_roles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_intro_meta_keywords" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_intro_meta_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_intro_meta_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_steps_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_steps_sidebar_left_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_steps_sidebar_right_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_intro_showcase_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_intro_meta_roles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_intro_meta_keywords" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_intro_meta_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_intro_meta_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_steps_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_steps_sidebar_left_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_steps_sidebar_right_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sidebar_variants" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_explore_section_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_contact_section_social_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_decorations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "project_page_intro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "project_detail_page_intro" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "sketchbook_images" CASCADE;
  DROP TABLE "sketchbook_external_links" CASCADE;
  DROP TABLE "sketchbook" CASCADE;
  DROP TABLE "sketchbook_rels" CASCADE;
  DROP TABLE "sketchlogs_images" CASCADE;
  DROP TABLE "sketchlogs" CASCADE;
  DROP TABLE "_sketchlogs_v_version_images" CASCADE;
  DROP TABLE "_sketchlogs_v" CASCADE;
  DROP TABLE "projects_intro_showcase_images" CASCADE;
  DROP TABLE "projects_intro_meta_roles" CASCADE;
  DROP TABLE "projects_intro_meta_keywords" CASCADE;
  DROP TABLE "projects_intro_meta_links" CASCADE;
  DROP TABLE "projects_intro_meta_tags" CASCADE;
  DROP TABLE "projects_steps_images" CASCADE;
  DROP TABLE "projects_steps_sidebar_left_images" CASCADE;
  DROP TABLE "projects_steps_sidebar_right_images" CASCADE;
  DROP TABLE "projects_steps" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "_projects_v_version_intro_showcase_images" CASCADE;
  DROP TABLE "_projects_v_version_intro_meta_roles" CASCADE;
  DROP TABLE "_projects_v_version_intro_meta_keywords" CASCADE;
  DROP TABLE "_projects_v_version_intro_meta_links" CASCADE;
  DROP TABLE "_projects_v_version_intro_meta_tags" CASCADE;
  DROP TABLE "_projects_v_version_steps_images" CASCADE;
  DROP TABLE "_projects_v_version_steps_sidebar_left_images" CASCADE;
  DROP TABLE "_projects_v_version_steps_sidebar_right_images" CASCADE;
  DROP TABLE "_projects_v_version_steps" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_rels" CASCADE;
  DROP TABLE "sidebar_variants" CASCADE;
  DROP TABLE "footer_explore_section_links" CASCADE;
  DROP TABLE "footer_contact_section_social_links" CASCADE;
  DROP TABLE "about_page_decorations" CASCADE;
  DROP TABLE "project_page_intro" CASCADE;
  DROP TABLE "project_detail_page_intro" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_hero_main_visual_group_main_visual_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_hero_title_group_title_image_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_hero_scroll_bar_group_scroll_bar_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_hero_decoration_group_decoration_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_hero_main_visual_group_main_visual_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_hero_title_group_title_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_hero_scroll_bar_group_scroll_bar_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_hero_decoration_group_decoration_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tags_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sketchbook_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sketchlogs_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sidebar_variants_fk";
  
  ALTER TABLE "header" DROP CONSTRAINT "header_logo_id_media_id_fk";
  
  ALTER TABLE "footer" DROP CONSTRAINT "footer_identity_section_icon_id_media_id_fk";
  
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE text;
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum_pages_hero_type";
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::"public"."enum_pages_hero_type";
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE "public"."enum_pages_hero_type" USING "hero_type"::"public"."enum_pages_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::"public"."enum__pages_v_version_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE "public"."enum__pages_v_version_hero_type" USING "version_hero_type"::"public"."enum__pages_v_version_hero_type";
  DROP INDEX "pages_hero_main_visual_group_hero_main_visual_group_main_visual_idx";
  DROP INDEX "pages_hero_title_group_hero_title_group_title_image_idx";
  DROP INDEX "pages_hero_scroll_bar_group_hero_scroll_bar_group_scroll_bar_idx";
  DROP INDEX "pages_hero_decoration_group_hero_decoration_group_decoration_image_idx";
  DROP INDEX "_pages_v_version_hero_main_visual_group_version_hero_main_visual_group_main_visual_idx";
  DROP INDEX "_pages_v_version_hero_title_group_version_hero_title_group_title_image_idx";
  DROP INDEX "_pages_v_version_hero_scroll_bar_group_version_hero_scroll_bar_group_scroll_bar_idx";
  DROP INDEX "_pages_v_version_hero_decoration_group_version_hero_decoration_group_decoration_image_idx";
  DROP INDEX "payload_locked_documents_rels_tags_id_idx";
  DROP INDEX "payload_locked_documents_rels_sketchbook_id_idx";
  DROP INDEX "payload_locked_documents_rels_sketchlogs_id_idx";
  DROP INDEX "payload_locked_documents_rels_projects_id_idx";
  DROP INDEX "payload_locked_documents_rels_sidebar_variants_id_idx";
  DROP INDEX "header_logo_idx";
  DROP INDEX "footer_identity_section_identity_section_icon_idx";
  ALTER TABLE "pages" DROP COLUMN "hero_main_visual_group_main_visual_id";
  ALTER TABLE "pages" DROP COLUMN "hero_title_group_title_image_id";
  ALTER TABLE "pages" DROP COLUMN "hero_scroll_bar_group_scroll_bar_id";
  ALTER TABLE "pages" DROP COLUMN "hero_decoration_group_decoration_image_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_main_visual_group_main_visual_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_title_group_title_image_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_scroll_bar_group_scroll_bar_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_decoration_group_decoration_image_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tags_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "sketchbook_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "sketchlogs_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "sidebar_variants_id";
  ALTER TABLE "header" DROP COLUMN "logo_id";
  ALTER TABLE "footer" DROP COLUMN "identity_section_title";
  ALTER TABLE "footer" DROP COLUMN "identity_section_icon_id";
  ALTER TABLE "footer" DROP COLUMN "identity_section_description";
  ALTER TABLE "footer" DROP COLUMN "explore_section_title";
  ALTER TABLE "footer" DROP COLUMN "contact_section_title";
  ALTER TABLE "footer" DROP COLUMN "copyright";
  DROP TYPE "public"."enum_sketchlogs_status";
  DROP TYPE "public"."enum__sketchlogs_v_version_status";
  DROP TYPE "public"."enum_projects_intro_meta_links_link_type";
  DROP TYPE "public"."enum_projects_steps_variant";
  DROP TYPE "public"."enum_projects_nav_footer_back_to_list_type";
  DROP TYPE "public"."enum_projects_nav_footer_back_to_list_appearance";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_intro_meta_links_link_type";
  DROP TYPE "public"."enum__projects_v_version_steps_variant";
  DROP TYPE "public"."enum__projects_v_version_nav_footer_back_to_list_type";
  DROP TYPE "public"."enum__projects_v_version_nav_footer_back_to_list_appearance";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum_footer_explore_section_links_link_type";
  DROP TYPE "public"."enum_footer_contact_section_social_links_platform";`)
}
