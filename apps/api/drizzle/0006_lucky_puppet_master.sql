CREATE TABLE "option" (
	"id" text PRIMARY KEY NOT NULL,
	"letter" text NOT NULL,
	"text" text NOT NULL,
	"question_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question" (
	"id" text PRIMARY KEY NOT NULL,
	"simulado_id" text NOT NULL,
	"question" text NOT NULL,
	"correct_answer" text NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "simulado" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"bank" text NOT NULL,
	"description" text,
	"subject" text NOT NULL,
	"time_to_respond" integer NOT NULL,
	"score" integer NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"responded_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "option" ADD CONSTRAINT "option_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question" ADD CONSTRAINT "question_simulado_id_simulado_id_fk" FOREIGN KEY ("simulado_id") REFERENCES "public"."simulado"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulado" ADD CONSTRAINT "simulado_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;