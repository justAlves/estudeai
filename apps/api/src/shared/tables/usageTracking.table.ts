import { date, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { user } from "./user.table";

export const usageTypeEnum = pgEnum("usage_type", ["simulado", "redacao"]);

export const usageTracking = pgTable("usage_tracking", {
  id: text("id").primaryKey().$defaultFn(createId),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'simulado' or 'redacao'
  weekStart: date("week_start").notNull(), // início da semana (segunda-feira)
  count: integer("count").default(0).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const usageTrackingRelations = relations(usageTracking, ({ one }) => ({
  user: one(user, {
    fields: [usageTracking.userId],
    references: [user.id],
  }),
}));

