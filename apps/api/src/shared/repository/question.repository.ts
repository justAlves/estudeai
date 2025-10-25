import { drizzle } from "../../config/db";
import { TCreateQuestionDto, TUpdateQuestionDto } from "../dto/question.dto";
import { Question } from "../entities";
import { question } from "../tables/question.table";
import { Effect, pipe } from "effect";
import { logger } from "../../config/logger";
import { eq } from "drizzle-orm";

export abstract class QuestionRepository {
    static async create(data: TCreateQuestionDto): Promise<Question> {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    const questionCreated = await drizzle.insert(question).values({
                        ...data,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }).returning();

                    logger.info(`Question created: ${questionCreated[0]}`);

                    return questionCreated[0];
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((question) => question),
            Effect.runPromise,
        )
    }

    static async findById(id: string): Promise<Question | null> {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    const questionFound = await drizzle.select().from(question).where(eq(question.id, id));
                    logger.info(`Question found: ${questionFound[0]}`);
                    return questionFound[0] || null;
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((questionFound) => questionFound),
            Effect.runPromise,
        )
    }

    static async findBySimuladoId(simuladoId: string): Promise<Question[]> {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    const questionsFound = await drizzle.select().from(question).where(eq(question.simuladoId, simuladoId));
                    logger.info(`Questions found for simulado: ${simuladoId}`);
                    return questionsFound;
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((questionsFound) => questionsFound),
            Effect.runPromise,
        )
    }

    static async findAll(): Promise<Question[]> {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    const questionsFound = await drizzle.select().from(question);
                    logger.info(`Questions found: ${questionsFound.length}`);
                    return questionsFound;
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((questionsFound) => questionsFound),
            Effect.runPromise,
        )
    }

    static async update(id: string, data: TUpdateQuestionDto): Promise<Question> {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    const questionUpdated = await drizzle.update(question).set({
                        ...data,
                        updatedAt: new Date(),
                    }).where(eq(question.id, id)).returning();
                    logger.info(`Question updated: ${questionUpdated[0]}`);
                    return questionUpdated[0];
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((questionUpdated) => questionUpdated),
            Effect.runPromise,
        )
    }

    static async delete(id: string): Promise<void> {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    await drizzle.delete(question).where(eq(question.id, id));
                    logger.info(`Question deleted: ${id}`);
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map(() => undefined),
            Effect.runPromise,
        )
    }
}

