import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_products_form" AS ENUM('injectable', 'oral-solution', 'water-soluble-powder', 'premix', 'feed-pellets', 'feed-mash', 'feed-crumbles', 'liquid', 'tablet', 'other');
  CREATE TYPE "public"."enum_products_availability_status" AS ENUM('inquiry_only', 'on_request', 'confirmed');
  CREATE TYPE "public"."enum_products_approval_status" AS ENUM('approved', 'review_required', 'placeholder_internal', 'hidden');
  CREATE TYPE "public"."enum__products_v_version_form" AS ENUM('injectable', 'oral-solution', 'water-soluble-powder', 'premix', 'feed-pellets', 'feed-mash', 'feed-crumbles', 'liquid', 'tablet', 'other');
  CREATE TYPE "public"."enum__products_v_version_availability_status" AS ENUM('inquiry_only', 'on_request', 'confirmed');
  CREATE TYPE "public"."enum__products_v_version_approval_status" AS ENUM('approved', 'review_required', 'placeholder_internal', 'hidden');
  CREATE TYPE "public"."enum_product_categories_key" AS ENUM('feed', 'supplements', 'medicines', 'vaccines');
  CREATE TYPE "public"."enum_poultry_segments_key" AS ENUM('broilers', 'layers', 'breeders');
  CREATE TYPE "public"."enum_articles_category" AS ENUM('farm-business', 'feed-supplements', 'vet-product-handling', 'company-news');
  CREATE TYPE "public"."enum_articles_approval_status" AS ENUM('approved', 'review_required', 'placeholder_internal', 'hidden');
  CREATE TYPE "public"."enum__articles_v_version_category" AS ENUM('farm-business', 'feed-supplements', 'vet-product-handling', 'company-news');
  CREATE TYPE "public"."enum__articles_v_version_approval_status" AS ENUM('approved', 'review_required', 'placeholder_internal', 'hidden');
  CREATE TYPE "public"."enum_faqs_placement" AS ENUM('home', 'products', 'contact');
  CREATE TYPE "public"."enum_faqs_approval_status" AS ENUM('approved', 'review_required', 'placeholder_internal', 'hidden');
  CREATE TYPE "public"."enum_media_license" AS ENUM('owned', 'commissioned', 'licensed', 'manufacturer', 'unknown');
  CREATE TYPE "public"."enum_inquiries_type" AS ENUM('farm', 'product', 'partner', 'general');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'contacted', 'qualified', 'closed', 'rejected');
  CREATE TYPE "public"."enum_inquiries_segment" AS ENUM('broilers', 'layers', 'breeders', 'multiple');
  CREATE TYPE "public"."enum_inquiries_product_category" AS ENUM('feed', 'supplements', 'medicines', 'vaccines', 'unsure');
  CREATE TYPE "public"."enum_inquiries_locale" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_content_approvals_state" AS ENUM('approved', 'review_required', 'placeholder_internal', 'hidden');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'sales');
  CREATE TYPE "public"."enum_metrics_items_key" AS ENUM('farms', 'birds', 'products');
  CREATE TYPE "public"."enum_site_settings_social_platform" AS ENUM('facebook', 'instagram', 'linkedin', 'youtube', 'x', 'tiktok');
  CREATE TYPE "public"."enum_site_settings_site_status" AS ENUM('staging', 'production');
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name_ar" varchar NOT NULL,
  	"name_en" varchar,
  	"category_id" integer NOT NULL,
  	"sku" varchar,
  	"form" "enum_products_form",
  	"manufacturer" varchar,
  	"manufacturer_verified" boolean DEFAULT false,
  	"availability_status" "enum_products_availability_status" DEFAULT 'inquiry_only' NOT NULL,
  	"label_pdf_id" integer,
  	"label_pdf_approved" boolean DEFAULT false,
  	"source_evidence" varchar,
  	"internal_notes" varchar,
  	"slug" varchar NOT NULL,
  	"approval_status" "enum_products_approval_status" DEFAULT 'review_required' NOT NULL,
  	"is_published" boolean DEFAULT false,
  	"approval_evidence" varchar,
  	"is_fixture" boolean DEFAULT false,
  	"search_text" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_locales" (
  	"pack_size" varchar,
  	"description" varchar,
  	"warnings" varchar,
  	"safety_text" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"poultry_segments_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name_ar" varchar NOT NULL,
  	"version_name_en" varchar,
  	"version_category_id" integer NOT NULL,
  	"version_sku" varchar,
  	"version_form" "enum__products_v_version_form",
  	"version_manufacturer" varchar,
  	"version_manufacturer_verified" boolean DEFAULT false,
  	"version_availability_status" "enum__products_v_version_availability_status" DEFAULT 'inquiry_only' NOT NULL,
  	"version_label_pdf_id" integer,
  	"version_label_pdf_approved" boolean DEFAULT false,
  	"version_source_evidence" varchar,
  	"version_internal_notes" varchar,
  	"version_slug" varchar NOT NULL,
  	"version_approval_status" "enum__products_v_version_approval_status" DEFAULT 'review_required' NOT NULL,
  	"version_is_published" boolean DEFAULT false,
  	"version_approval_evidence" varchar,
  	"version_is_fixture" boolean DEFAULT false,
  	"version_search_text" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_products_v_locales" (
  	"version_pack_size" varchar,
  	"version_description" varchar,
  	"version_warnings" varchar,
  	"version_safety_text" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"poultry_segments_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "product_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" "enum_product_categories_key" NOT NULL,
  	"image_id" integer,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "product_categories_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "poultry_segments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" "enum_poultry_segments_key" NOT NULL,
  	"image_id" integer,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "poultry_segments_locales" (
  	"name" varchar NOT NULL,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "articles_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" "enum_articles_category" NOT NULL,
  	"cover_image_id" integer,
  	"author" varchar,
  	"author_verified" boolean DEFAULT false,
  	"professional_review" boolean DEFAULT false,
  	"reviewer" varchar,
  	"published_at" timestamp(3) with time zone,
  	"slug" varchar NOT NULL,
  	"approval_status" "enum_articles_approval_status" DEFAULT 'review_required' NOT NULL,
  	"is_published" boolean DEFAULT false,
  	"approval_evidence" varchar,
  	"is_fixture" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "articles_locales" (
  	"title" varchar NOT NULL,
  	"excerpt" varchar,
  	"body" jsonb NOT NULL,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_articles_v_version_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_category" "enum__articles_v_version_category" NOT NULL,
  	"version_cover_image_id" integer,
  	"version_author" varchar,
  	"version_author_verified" boolean DEFAULT false,
  	"version_professional_review" boolean DEFAULT false,
  	"version_reviewer" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_slug" varchar NOT NULL,
  	"version_approval_status" "enum__articles_v_version_approval_status" DEFAULT 'review_required' NOT NULL,
  	"version_is_published" boolean DEFAULT false,
  	"version_approval_evidence" varchar,
  	"version_is_fixture" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_articles_v_locales" (
  	"version_title" varchar NOT NULL,
  	"version_excerpt" varchar,
  	"version_body" jsonb NOT NULL,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "faqs_placement" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_faqs_placement",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 0,
  	"approval_status" "enum_faqs_approval_status" DEFAULT 'review_required' NOT NULL,
  	"is_published" boolean DEFAULT false,
  	"approval_evidence" varchar,
  	"is_fixture" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"license" "enum_media_license" DEFAULT 'unknown' NOT NULL,
  	"credit" varchar,
  	"rights_evidence" varchar,
  	"rights_expire_at" timestamp(3) with time zone,
  	"restricted" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_wide_url" varchar,
  	"sizes_wide_width" numeric,
  	"sizes_wide_height" numeric,
  	"sizes_wide_mime_type" varchar,
  	"sizes_wide_filesize" numeric,
  	"sizes_wide_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "inquiries_status_history" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"status" varchar,
  	"at" timestamp(3) with time zone,
  	"by" varchar
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference" varchar NOT NULL,
  	"type" "enum_inquiries_type" NOT NULL,
  	"status" "enum_inquiries_status" DEFAULT 'new' NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar,
  	"organization" varchar,
  	"role" varchar,
  	"governorate" varchar,
  	"segment" "enum_inquiries_segment",
  	"product_category" "enum_inquiries_product_category",
  	"product_ref_id" integer,
  	"product_label" varchar,
  	"bird_capacity" varchar,
  	"quantity" varchar,
  	"product_line" varchar,
  	"request_details" varchar,
  	"locale" "enum_inquiries_locale",
  	"source_path" varchar,
  	"consent_at" timestamp(3) with time zone NOT NULL,
  	"idempotency_key" varchar,
  	"admin_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "content_approvals" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL,
  	"location" varchar,
  	"state" "enum_content_approvals_state" DEFAULT 'review_required' NOT NULL,
  	"owner" varchar,
  	"evidence" varchar,
  	"evidence_file_id" integer,
  	"approved_by_id" integer,
  	"approved_at" timestamp(3) with time zone,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'sales' NOT NULL,
  	"can_approve" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"product_categories_id" integer,
  	"poultry_segments_id" integer,
  	"articles_id" integer,
  	"faqs_id" integer,
  	"media_id" integer,
  	"inquiries_id" integer,
  	"content_approvals_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "homepage_hero_headline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "homepage_hero_headline_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_statement_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "homepage_statement_lines_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_closing_headline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "homepage_closing_headline_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"show_proof" boolean DEFAULT true,
  	"show_statement" boolean DEFAULT true,
  	"show_farm_types" boolean DEFAULT true,
  	"show_product_universe" boolean DEFAULT true,
  	"show_journey" boolean DEFAULT true,
  	"show_values" boolean DEFAULT true,
  	"show_product_preview" boolean DEFAULT true,
  	"show_partner_proof" boolean DEFAULT true,
  	"show_faq" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_locales" (
  	"hero_eyebrow" varchar,
  	"hero_subhead" varchar,
  	"hero_primary_cta" varchar,
  	"hero_secondary_cta" varchar,
  	"closing_subhead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "metrics_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" "enum_metrics_items_key" NOT NULL,
  	"value" varchar NOT NULL,
  	"accuracy_note" varchar
  );
  
  CREATE TABLE "metrics_items_locales" (
  	"qualifier" varchar NOT NULL,
  	"unit" varchar,
  	"label" varchar NOT NULL,
  	"sr_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "metrics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "metrics_locales" (
  	"footnote" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_social_platform" NOT NULL,
  	"url" varchar NOT NULL,
  	"verified" boolean DEFAULT false
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"phone_value" varchar,
  	"phone_verified" boolean DEFAULT false,
  	"whatsapp_value" varchar,
  	"whatsapp_verified" boolean DEFAULT false,
  	"email_value" varchar,
  	"email_verified" boolean DEFAULT false,
  	"address_map_url" varchar,
  	"address_verified" boolean DEFAULT false,
  	"brand_source" varchar DEFAULT 'Alshorouk_Brand_Guidelines.pdf v1.0 (October 2026) — logo vectors extracted from PDF pages 3 and 9',
  	"site_status" "enum_site_settings_site_status" DEFAULT 'staging',
  	"show_knowledge_hub" boolean DEFAULT true,
  	"english_approved" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"address_value" varchar,
  	"legal_name" varchar,
  	"footer_notice" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "products" ADD CONSTRAINT "products_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_label_pdf_id_media_id_fk" FOREIGN KEY ("label_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_poultry_segments_fk" FOREIGN KEY ("poultry_segments_id") REFERENCES "public"."poultry_segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_category_id_product_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_label_pdf_id_media_id_fk" FOREIGN KEY ("version_label_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_poultry_segments_fk" FOREIGN KEY ("poultry_segments_id") REFERENCES "public"."poultry_segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_categories_locales" ADD CONSTRAINT "product_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "poultry_segments" ADD CONSTRAINT "poultry_segments_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "poultry_segments_locales" ADD CONSTRAINT "poultry_segments_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."poultry_segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_sources" ADD CONSTRAINT "articles_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_version_sources" ADD CONSTRAINT "_articles_v_version_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_locales" ADD CONSTRAINT "_articles_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_placement" ADD CONSTRAINT "faqs_placement_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_locales" ADD CONSTRAINT "faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiries_status_history" ADD CONSTRAINT "inquiries_status_history_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_product_ref_id_products_id_fk" FOREIGN KEY ("product_ref_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "content_approvals" ADD CONSTRAINT "content_approvals_evidence_file_id_media_id_fk" FOREIGN KEY ("evidence_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "content_approvals" ADD CONSTRAINT "content_approvals_approved_by_id_users_id_fk" FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_poultry_segments_fk" FOREIGN KEY ("poultry_segments_id") REFERENCES "public"."poultry_segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_content_approvals_fk" FOREIGN KEY ("content_approvals_id") REFERENCES "public"."content_approvals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_hero_headline" ADD CONSTRAINT "homepage_hero_headline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_hero_headline_locales" ADD CONSTRAINT "homepage_hero_headline_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_hero_headline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_statement_lines" ADD CONSTRAINT "homepage_statement_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_statement_lines_locales" ADD CONSTRAINT "homepage_statement_lines_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_statement_lines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_closing_headline" ADD CONSTRAINT "homepage_closing_headline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_closing_headline_locales" ADD CONSTRAINT "homepage_closing_headline_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_closing_headline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_locales" ADD CONSTRAINT "homepage_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "metrics_items" ADD CONSTRAINT "metrics_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "metrics_items_locales" ADD CONSTRAINT "metrics_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."metrics_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "metrics_locales" ADD CONSTRAINT "metrics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social" ADD CONSTRAINT "site_settings_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");
  CREATE INDEX "products_sku_idx" ON "products" USING btree ("sku");
  CREATE INDEX "products_label_pdf_idx" ON "products" USING btree ("label_pdf_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_approval_status_idx" ON "products" USING btree ("approval_status");
  CREATE INDEX "products_is_published_idx" ON "products" USING btree ("is_published");
  CREATE INDEX "products_is_fixture_idx" ON "products" USING btree ("is_fixture");
  CREATE INDEX "products_search_text_idx" ON "products" USING btree ("search_text");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_poultry_segments_id_idx" ON "products_rels" USING btree ("poultry_segments_id");
  CREATE INDEX "products_rels_media_id_idx" ON "products_rels" USING btree ("media_id");
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version_category_idx" ON "_products_v" USING btree ("version_category_id");
  CREATE INDEX "_products_v_version_version_sku_idx" ON "_products_v" USING btree ("version_sku");
  CREATE INDEX "_products_v_version_version_label_pdf_idx" ON "_products_v" USING btree ("version_label_pdf_id");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "_products_v" USING btree ("version_slug");
  CREATE INDEX "_products_v_version_version_approval_status_idx" ON "_products_v" USING btree ("version_approval_status");
  CREATE INDEX "_products_v_version_version_is_published_idx" ON "_products_v" USING btree ("version_is_published");
  CREATE INDEX "_products_v_version_version_is_fixture_idx" ON "_products_v" USING btree ("version_is_fixture");
  CREATE INDEX "_products_v_version_version_search_text_idx" ON "_products_v" USING btree ("version_search_text");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "_products_v_locales_locale_parent_id_unique" ON "_products_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_rels_order_idx" ON "_products_v_rels" USING btree ("order");
  CREATE INDEX "_products_v_rels_parent_idx" ON "_products_v_rels" USING btree ("parent_id");
  CREATE INDEX "_products_v_rels_path_idx" ON "_products_v_rels" USING btree ("path");
  CREATE INDEX "_products_v_rels_poultry_segments_id_idx" ON "_products_v_rels" USING btree ("poultry_segments_id");
  CREATE INDEX "_products_v_rels_media_id_idx" ON "_products_v_rels" USING btree ("media_id");
  CREATE UNIQUE INDEX "product_categories_key_idx" ON "product_categories" USING btree ("key");
  CREATE INDEX "product_categories_image_idx" ON "product_categories" USING btree ("image_id");
  CREATE INDEX "product_categories_updated_at_idx" ON "product_categories" USING btree ("updated_at");
  CREATE INDEX "product_categories_created_at_idx" ON "product_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "product_categories_locales_locale_parent_id_unique" ON "product_categories_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "poultry_segments_key_idx" ON "poultry_segments" USING btree ("key");
  CREATE INDEX "poultry_segments_image_idx" ON "poultry_segments" USING btree ("image_id");
  CREATE INDEX "poultry_segments_updated_at_idx" ON "poultry_segments" USING btree ("updated_at");
  CREATE INDEX "poultry_segments_created_at_idx" ON "poultry_segments" USING btree ("created_at");
  CREATE UNIQUE INDEX "poultry_segments_locales_locale_parent_id_unique" ON "poultry_segments_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "articles_sources_order_idx" ON "articles_sources" USING btree ("_order");
  CREATE INDEX "articles_sources_parent_id_idx" ON "articles_sources" USING btree ("_parent_id");
  CREATE INDEX "articles_category_idx" ON "articles" USING btree ("category");
  CREATE INDEX "articles_cover_image_idx" ON "articles" USING btree ("cover_image_id");
  CREATE INDEX "articles_published_at_idx" ON "articles" USING btree ("published_at");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_approval_status_idx" ON "articles" USING btree ("approval_status");
  CREATE INDEX "articles_is_published_idx" ON "articles" USING btree ("is_published");
  CREATE INDEX "articles_is_fixture_idx" ON "articles" USING btree ("is_fixture");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE UNIQUE INDEX "articles_locales_locale_parent_id_unique" ON "articles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_articles_v_version_sources_order_idx" ON "_articles_v_version_sources" USING btree ("_order");
  CREATE INDEX "_articles_v_version_sources_parent_id_idx" ON "_articles_v_version_sources" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_category_idx" ON "_articles_v" USING btree ("version_category");
  CREATE INDEX "_articles_v_version_version_cover_image_idx" ON "_articles_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_articles_v_version_version_published_at_idx" ON "_articles_v" USING btree ("version_published_at");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_version_approval_status_idx" ON "_articles_v" USING btree ("version_approval_status");
  CREATE INDEX "_articles_v_version_version_is_published_idx" ON "_articles_v" USING btree ("version_is_published");
  CREATE INDEX "_articles_v_version_version_is_fixture_idx" ON "_articles_v" USING btree ("version_is_fixture");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "_articles_v_locales_locale_parent_id_unique" ON "_articles_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "faqs_placement_order_idx" ON "faqs_placement" USING btree ("order");
  CREATE INDEX "faqs_placement_parent_idx" ON "faqs_placement" USING btree ("parent_id");
  CREATE INDEX "faqs_approval_status_idx" ON "faqs" USING btree ("approval_status");
  CREATE INDEX "faqs_is_published_idx" ON "faqs" USING btree ("is_published");
  CREATE INDEX "faqs_is_fixture_idx" ON "faqs" USING btree ("is_fixture");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE UNIQUE INDEX "faqs_locales_locale_parent_id_unique" ON "faqs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_wide_sizes_wide_filename_idx" ON "media" USING btree ("sizes_wide_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "inquiries_status_history_order_idx" ON "inquiries_status_history" USING btree ("_order");
  CREATE INDEX "inquiries_status_history_parent_id_idx" ON "inquiries_status_history" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "inquiries_reference_idx" ON "inquiries" USING btree ("reference");
  CREATE INDEX "inquiries_type_idx" ON "inquiries" USING btree ("type");
  CREATE INDEX "inquiries_status_idx" ON "inquiries" USING btree ("status");
  CREATE INDEX "inquiries_product_ref_idx" ON "inquiries" USING btree ("product_ref_id");
  CREATE UNIQUE INDEX "inquiries_idempotency_key_idx" ON "inquiries" USING btree ("idempotency_key");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE INDEX "content_approvals_evidence_file_idx" ON "content_approvals" USING btree ("evidence_file_id");
  CREATE INDEX "content_approvals_approved_by_idx" ON "content_approvals" USING btree ("approved_by_id");
  CREATE INDEX "content_approvals_updated_at_idx" ON "content_approvals" USING btree ("updated_at");
  CREATE INDEX "content_approvals_created_at_idx" ON "content_approvals" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_product_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("product_categories_id");
  CREATE INDEX "payload_locked_documents_rels_poultry_segments_id_idx" ON "payload_locked_documents_rels" USING btree ("poultry_segments_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_content_approvals_id_idx" ON "payload_locked_documents_rels" USING btree ("content_approvals_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "homepage_hero_headline_order_idx" ON "homepage_hero_headline" USING btree ("_order");
  CREATE INDEX "homepage_hero_headline_parent_id_idx" ON "homepage_hero_headline" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_hero_headline_locales_locale_parent_id_unique" ON "homepage_hero_headline_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_statement_lines_order_idx" ON "homepage_statement_lines" USING btree ("_order");
  CREATE INDEX "homepage_statement_lines_parent_id_idx" ON "homepage_statement_lines" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_statement_lines_locales_locale_parent_id_unique" ON "homepage_statement_lines_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_closing_headline_order_idx" ON "homepage_closing_headline" USING btree ("_order");
  CREATE INDEX "homepage_closing_headline_parent_id_idx" ON "homepage_closing_headline" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_closing_headline_locales_locale_parent_id_unique" ON "homepage_closing_headline_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "homepage_locales_locale_parent_id_unique" ON "homepage_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "metrics_items_order_idx" ON "metrics_items" USING btree ("_order");
  CREATE INDEX "metrics_items_parent_id_idx" ON "metrics_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "metrics_items_locales_locale_parent_id_unique" ON "metrics_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "metrics_locales_locale_parent_id_unique" ON "metrics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_social_order_idx" ON "site_settings_social" USING btree ("_order");
  CREATE INDEX "site_settings_social_parent_id_idx" ON "site_settings_social" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "_products_v_locales" CASCADE;
  DROP TABLE "_products_v_rels" CASCADE;
  DROP TABLE "product_categories" CASCADE;
  DROP TABLE "product_categories_locales" CASCADE;
  DROP TABLE "poultry_segments" CASCADE;
  DROP TABLE "poultry_segments_locales" CASCADE;
  DROP TABLE "articles_sources" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_locales" CASCADE;
  DROP TABLE "_articles_v_version_sources" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "_articles_v_locales" CASCADE;
  DROP TABLE "faqs_placement" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "faqs_locales" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "inquiries_status_history" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "content_approvals" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "homepage_hero_headline" CASCADE;
  DROP TABLE "homepage_hero_headline_locales" CASCADE;
  DROP TABLE "homepage_statement_lines" CASCADE;
  DROP TABLE "homepage_statement_lines_locales" CASCADE;
  DROP TABLE "homepage_closing_headline" CASCADE;
  DROP TABLE "homepage_closing_headline_locales" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "homepage_locales" CASCADE;
  DROP TABLE "metrics_items" CASCADE;
  DROP TABLE "metrics_items_locales" CASCADE;
  DROP TABLE "metrics" CASCADE;
  DROP TABLE "metrics_locales" CASCADE;
  DROP TABLE "site_settings_social" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_products_form";
  DROP TYPE "public"."enum_products_availability_status";
  DROP TYPE "public"."enum_products_approval_status";
  DROP TYPE "public"."enum__products_v_version_form";
  DROP TYPE "public"."enum__products_v_version_availability_status";
  DROP TYPE "public"."enum__products_v_version_approval_status";
  DROP TYPE "public"."enum_product_categories_key";
  DROP TYPE "public"."enum_poultry_segments_key";
  DROP TYPE "public"."enum_articles_category";
  DROP TYPE "public"."enum_articles_approval_status";
  DROP TYPE "public"."enum__articles_v_version_category";
  DROP TYPE "public"."enum__articles_v_version_approval_status";
  DROP TYPE "public"."enum_faqs_placement";
  DROP TYPE "public"."enum_faqs_approval_status";
  DROP TYPE "public"."enum_media_license";
  DROP TYPE "public"."enum_inquiries_type";
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_inquiries_segment";
  DROP TYPE "public"."enum_inquiries_product_category";
  DROP TYPE "public"."enum_inquiries_locale";
  DROP TYPE "public"."enum_content_approvals_state";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_metrics_items_key";
  DROP TYPE "public"."enum_site_settings_social_platform";
  DROP TYPE "public"."enum_site_settings_site_status";`)
}
