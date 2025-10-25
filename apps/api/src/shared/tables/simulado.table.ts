import { createId } from "@paralleldrive/cuid2";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user.table";
import { relations } from "drizzle-orm";

export const simulado = pgTable("simulado", {
  id: text("id").primaryKey().$defaultFn(createId),
  title: text('title').notNull(),
  bank: text('bank').notNull(),
  description: text('description'),
  subject: text('subject').notNull(),
  timeToRespond: integer('time_to_respond').notNull(),
  score: integer('score').notNull(),
  userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  status: text('status').notNull().default('pending'),
  respondedAt: timestamp('responded_at'),
});

export const simuladoRelations = relations(simulado, ({ one }) => ({
  user: one(user, {
    fields: [simulado.userId],
    references: [user.id],
  }),
}));