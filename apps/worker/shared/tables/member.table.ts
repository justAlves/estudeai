import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user.table";
import { organization } from "./organization.table";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";

export const member = pgTable("member", {
  id: text('id').primaryKey().$defaultFn(createId),
  organizationId: text('organization_id').notNull().references(()=> organization.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
  role: text('role').default("member").notNull(),
  createdAt: timestamp('created_at').notNull()
});

export const memberRelations = relations(member, ({ one }) => ({
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
}));