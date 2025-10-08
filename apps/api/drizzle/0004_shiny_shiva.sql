CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'non_binary', 'other');--> statement-breakpoint
CREATE TYPE "public"."goals" AS ENUM('loss_weight', 'gain_mass', 'keep_fit', 'improve_conditioning');--> statement-breakpoint
CREATE TYPE "public"."preferred_local" AS ENUM('home', 'gym', 'outside');--> statement-breakpoint
CREATE TYPE "public"."training_level" AS ENUM('beginner', 'intermediate', 'advanced');--> statement-breakpoint
CREATE TABLE "user_info" (
	"id" text PRIMARY KEY NOT NULL,
	"social_name" text,
	"gender" "gender",
	"birthday" timestamp,
	"weight" text,
	"height" text,
	"goals" "goals",
	"specific_goal" text,
	"trainingLevel" "training_level",
	"training_days" integer,
	"training_time" integer,
	"available_equipment" text[],
	"preferredLocal" "preferred_local",
	"medical_conditions" text[],
	"food_restrictions" text[],
	"food_preferences" text,
	"allergies" text,
	"created_at" timestamp DEFAULT now(),
	"user_id" text
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_premium" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user_info" ADD CONSTRAINT "user_info_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;