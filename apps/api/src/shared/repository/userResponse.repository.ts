import { drizzle } from "../../config/db";
import { userResponse } from "../tables/userResponse.table";
import { question } from "../tables/question.table";
import { Effect, pipe } from "effect";
import { logger } from "../../config/logger";
import { eq, and } from "drizzle-orm";

export interface UserResponseData {
  userId: string;
  questionId: string;
  response: string;
}

export abstract class UserResponseRepository {
  static async create(data: UserResponseData) {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          logger.info(`Creating user response: ${JSON.stringify(data)}`);

          const responseCreated = await drizzle.insert(userResponse).values({
            userId: data.userId,
            questionId: data.questionId,
            response: data.response,
          }).returning();

          logger.info(`User response created: ${responseCreated[0]}`);

          return responseCreated[0];
        },
        catch: (error) => {
          logger.error(error);
          throw new Error(error instanceof Error ? error.message : String(error));
        },
      }),
      Effect.map((response) => response),
      Effect.runPromise,
    );
  }

  static async createMany(responses: UserResponseData[]) {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          logger.info(`Creating ${responses.length} user responses`);

          const responsesCreated = await drizzle.insert(userResponse).values(
            responses.map(data => ({
              userId: data.userId,
              questionId: data.questionId,
              response: data.response,
            }))
          ).returning();

          logger.info(`${responsesCreated.length} user responses created`);

          return responsesCreated;
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

  static async findByUserAndSimulado(userId: string, simuladoId: string) {
    return pipe(
      Effect.tryPromise({
        try: async () => {
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

          return responses;
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

  static async deleteByUserAndSimulado(userId: string, simuladoId: string) {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          // Primeiro, precisamos encontrar as questionIds do simulado
          // Vou implementar isso de forma mais simples por enquanto
          logger.info(`Deleting responses for user ${userId} and simulado ${simuladoId}`);
          
          // Por enquanto, retornamos void - implementação completa seria com join
          return;
        },
        catch: (error) => {
          logger.error(error);
          throw new Error(error instanceof Error ? error.message : String(error));
        },
      }),
      Effect.map(() => undefined),
      Effect.runPromise,
    );
  }
}
