import { simulado } from "../tables/simulado.table"
import { user as userTable } from "../tables/user.table"
import { question, option } from "../tables/question.table"

export type User = typeof userTable.$inferSelect
export type Simulado = typeof simulado.$inferSelect
export type Question = typeof question.$inferSelect
export type Option = typeof option.$inferSelect

export type QuestionWithOptions = Question & { options: Option[] }
export type SimuladoWithQuestions = Simulado & { questions: QuestionWithOptions[] }