import { createId } from "@paralleldrive/cuid2";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user.table";
import { relations } from "drizzle-orm";
import { redacaoCorrection } from "./redacaoCorrection.table";

export const redacaoStatusEnum = pgEnum("redacao_status", ["pending", "correcting", "corrected", "error"]);

export const redacao = pgTable("redacao", {
  id: text("id").primaryKey().$defaultFn(createId),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  theme: text("theme").notNull(),
  content: text("content").notNull(),
  bank: text("bank"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  correctedAt: timestamp("corrected_at"),
});

export const redacaoRelations = relations(redacao, ({ one }) => ({
  user: one(user, {
    fields: [redacao.userId],
    references: [user.id],
  }),
  correction: one(redacaoCorrection),
}));

