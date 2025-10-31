import { simulado } from "../tables/simulado.table"
import { user as userTable } from "../tables/user.table"
import { question, option } from "../tables/question.table"
import { redacao } from "../tables/redacao.table"
import { redacaoCorrection } from "../tables/redacaoCorrection.table"
import { subscription } from "../tables/subscription.table"
import { usageTracking } from "../tables/usageTracking.table"

export type User = typeof userTable.$inferSelect
export type Simulado = typeof simulado.$inferSelect
export type Question = typeof question.$inferSelect
export type Option = typeof option.$inferSelect
export type Redacao = typeof redacao.$inferSelect
export type RedacaoCorrection = typeof redacaoCorrection.$inferSelect
export type Subscription = typeof subscription.$inferSelect
export type UsageTracking = typeof usageTracking.$inferSelect

export type QuestionWithOptions = Question & { options: Option[] }
export type SimuladoWithQuestions = Simulado & { questions: QuestionWithOptions[] }
export type RedacaoWithCorrection = Redacao & { correction?: RedacaoCorrection | null }
