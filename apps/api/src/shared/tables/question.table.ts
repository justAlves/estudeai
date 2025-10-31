import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { timestamp } from "drizzle-orm/pg-core";
import { simulado } from "./simulado.table";
import { relations } from "drizzle-orm";

export const question = pgTable("question", {
  id: text('id').primaryKey().$defaultFn(createId),
  simuladoId: text('simulado_id').notNull().references(()=> simulado.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  correctAnswer: text('correct_answer').notNull(),
  order: integer('order').notNull(),
  explanation: text('explanation'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const option = pgTable("option", {
  id: text('id').primaryKey().$defaultFn(createId),
  letter: text('letter').notNull(),
  text: text('text').notNull(),
  explanation: text('explanation'),
  questionId: text('question_id').notNull().references(()=> question.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const questionRelations = relations(question, ({ one, many }) => ({
  simulado: one(simulado, {
    fields: [question.simuladoId],
    references: [simulado.id],
  }),
  options: many(option),
}));

export const optionRelations = relations(option, ({ one }) => ({
  question: one(question, {
    fields: [option.questionId],
    references: [question.id],
  }),
}));