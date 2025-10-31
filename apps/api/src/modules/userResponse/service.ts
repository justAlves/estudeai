import { Effect, pipe } from "effect";
import { UserResponseRepository } from "../../shared/repository/userResponse.repository";
import { SimuladoRepository } from "../../shared/repository/simulado.repository";
import { logger } from "../../config/logger";
import { question } from "../../shared/tables/question.table";
import { userResponse } from "../../shared/tables/userResponse.table";
import { simulado as simuladoTable } from "../../shared/tables/simulado.table";
import { eq, and } from "drizzle-orm";
import { drizzle } from "../../config/db";

export interface SubmitSimuladoData {
  simuladoId: string;
  userId: string;
  answers: Array<{
    questionId: string;
    selectedOption: string;
  }>;
  timeElapsed: number; // em segundos
}

export abstract class UserResponseService {
  static async submitSimulado(data: SubmitSimuladoData) {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          logger.info(`Submitting simulado ${data.simuladoId} for user ${data.userId}`);

          // 1. Buscar o simulado para validar
          const simulado = await SimuladoRepository.findById(data.simuladoId);
          if (!simulado) {
            throw new Error("Simulado não encontrado");
          }

          // 2. Verificar se o usuário é o dono do simulado
          if (simulado.userId !== data.userId) {
            throw new Error("Usuário não autorizado");
          }

          // 3. Verificar se o simulado já foi respondido
          if (simulado.status === 'answered') {
            throw new Error("Simulado já foi respondido");
          }

          // 4. Calcular o score
          let correctAnswers = 0;
          const questionMap = new Map(simulado.questions.map(q => [q.id, q]));

          logger.info(`Calculating score for ${data.answers.length} answers`);
          
          for (const answer of data.answers) {
            const question = questionMap.get(answer.questionId);
            if (question) {
              logger.info(`Question ${answer.questionId}: selected=${answer.selectedOption}, correct=${question.correctAnswer}`);
              if (answer.selectedOption === question.correctAnswer) {
                correctAnswers++;
              }
            } else {
              logger.warn(`Question ${answer.questionId} not found in questionMap`);
            }
          }

          const score = Math.round((correctAnswers / simulado.questions.length) * 100);

          // 5. Salvar as respostas do usuário
          const userResponses = data.answers.map(answer => ({
            userId: data.userId,
            questionId: answer.questionId,
            response: answer.selectedOption,
          }));

          await UserResponseRepository.createMany(userResponses);

          // 6. Atualizar o simulado diretamente no banco
          await drizzle.update(simuladoTable).set({
            status: 'answered',
            score: score,
            timeToRespond: data.timeElapsed,
            respondedAt: new Date(),
          }).where(eq(simuladoTable.id, data.simuladoId));

          logger.info(`Simulado ${data.simuladoId} submitted successfully. Score: ${score}%, Time: ${data.timeElapsed}s`);

          return {
            simuladoId: data.simuladoId,
            score,
            timeElapsed: data.timeElapsed,
            correctAnswers,
            totalQuestions: simulado.questions.length,
          };
        },
        catch: (error) => {
          logger.error(error);
          throw new Error(error instanceof Error ? error.message : String(error));
        },
      }),
      Effect.map((result) => result),
      Effect.runPromise,
    );
  }

  static async getUserResponses(userId: string, simuladoId: string) {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          // Buscar respostas do usuário para um simulado específico
          const responses = await drizzle
            .select()
            .from(userResponse)
            .innerJoin(question, eq(userResponse.questionId, question.id))
            .where(
              and(
                eq(userResponse.userId, userId),
                eq(question.simuladoId, simuladoId)
              )
            );

          logger.info(`Found ${responses.length} responses for user ${userId} and simulado ${simuladoId}`);

          return responses.map(row => ({
            questionId: row.user_response.questionId,
            response: row.user_response.response,
            question: row.question.question,
            correctAnswer: row.question.correctAnswer,
            isCorrect: row.user_response.response === row.question.correctAnswer,
          }));
        },
        catch: (error) => {
          logger.error(error);
          throw new Error(error instanceof Error ? error.message : String(error));
        },
      }),
      Effect.map((responses) => responses),
      Effect.runPromise,
    );
  }
}
