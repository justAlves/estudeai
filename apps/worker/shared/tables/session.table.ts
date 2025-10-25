import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user.table";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";

export const session = pgTable("session", {
  id: text('id').primaryKey().$defaultFn(createId),
	expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
  impersonatedBy: text('impersonated_by'),
  activeOrganizationId: text('active_organization_id')
});

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));