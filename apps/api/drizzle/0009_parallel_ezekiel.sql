CREATE TYPE "public"."redacao_status" AS ENUM('pending', 'correcting', 'corrected', 'error');--> statement-breakpoint
CREATE TABLE "redacao" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"theme" text NOT NULL,
	"content" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"corrected_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "redacao_correction" (
	"id" text PRIMARY KEY NOT NULL,
	"redacao_id" text NOT NULL,
	"competencia1" integer NOT NULL,
	"competencia2" integer NOT NULL,
	"competencia3" integer NOT NULL,
	"competencia4" integer NOT NULL,
	"competencia5" integer NOT NULL,
	"total_score" integer NOT NULL,
	"feedback" text NOT NULL,
	"feedback_por_competencia" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "redacao" ADD CONSTRAINT "redacao_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "redacao_correction" ADD CONSTRAINT "redacao_correction_redacao_id_redacao_id_fk" FOREIGN KEY ("redacao_id") REFERENCES "public"."redacao"("id") ON DELETE cascade ON UPDATE no action;