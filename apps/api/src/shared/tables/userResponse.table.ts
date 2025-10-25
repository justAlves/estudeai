import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user.table";
import { question } from "./question.table";
import { relations } from "drizzle-orm";

export const userResponse = pgTable("user_response", {
  id: text('id').primaryKey().$defaultFn(createId),
  userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
  questionId: text('question_id').notNull().references(()=> question.id, { onDelete: 'cascade' }),
  response: text('response').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userResponseRelations = relations(userResponse, ({ one }) => ({
  user: one(user, {
    fields: [userResponse.userId],
    references: [user.id],
  }),
  question: one(question, {
    fields: [userResponse.questionId],
    references: [question.id],
  }),
}));