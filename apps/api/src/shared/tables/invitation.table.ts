import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user.table";
import { organization } from "./organization.table";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";

export const invitation = pgTable("invitation", {
	id: text('id').primaryKey().$defaultFn(createId),
	organizationId: text('organization_id').notNull().references(()=> organization.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: text('role'),
  status: text('status').default("pending").notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  inviterId: text('inviter_id').notNull().references(()=> user.id, { onDelete: 'cascade' })
});

export const invitationRelations = relations(invitation, ({ one }) => ({
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id],
  }),
  inviter: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
  }),
}));