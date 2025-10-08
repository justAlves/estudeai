DROP TABLE "collection" CASCADE;--> statement-breakpoint
DROP TABLE "user_info" CASCADE;--> statement-breakpoint
DROP TABLE "video" CASCADE;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "is_premium";--> statement-breakpoint
DROP TYPE "public"."gender";--> statement-breakpoint
DROP TYPE "public"."goals";--> statement-breakpoint
DROP TYPE "public"."preferred_local";--> statement-breakpoint
DROP TYPE "public"."training_level";