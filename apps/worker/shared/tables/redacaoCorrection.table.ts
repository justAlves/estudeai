import { createId } from "@paralleldrive/cuid2";
import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { redacao } from "./redacao.table";
import { relations } from "drizzle-orm";

export const redacaoCorrection = pgTable("redacao_correction", {
  id: text("id").primaryKey().$defaultFn(createId),
  redacaoId: text("redacao_id").notNull().references(() => redacao.id, { onDelete: "cascade" }),
  competencia1: integer("competencia1").notNull(),
  competencia2: integer("competencia2").notNull(),
  competencia3: integer("competencia3").notNull(),
  competencia4: integer("competencia4").notNull(),
  competencia5: integer("competencia5").notNull(),
  totalScore: integer("total_score").notNull(),
  feedback: text("feedback").notNull(),
  feedbackPorCompetencia: jsonb("feedback_por_competencia"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const redacaoCorrectionRelations = relations(redacaoCorrection, ({ one }) => ({
  redacao: one(redacao, {
    fields: [redacaoCorrection.redacaoId],
    references: [redacao.id],
  }),
}));

