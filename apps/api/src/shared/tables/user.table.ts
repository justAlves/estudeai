import { boolean, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2"
import { relations } from "drizzle-orm";
import { account } from "./account.table";
import { session } from "./session.table";
import { member } from "./member.table";
import { invitation } from "./invitation.table";

export const user = pgTable("user", {
  id: text('id').primaryKey().$defaultFn(createId),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').$defaultFn(() => !1).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').$defaultFn(() => new Date).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date).notNull(),
  role: text('role'),
  banned: boolean('banned'),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires'),
});

export const userRelations = relations(user, ({ many, one }) => ({
  accounts: many(account),
  sessions: many(session),
  members: many(member),
  invitations: many(invitation),
}));