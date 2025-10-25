import { drizzle } from "../../config/db";
import { TCreateOptionDto, TUpdateOptionDto } from "../dto/option.dto";
import { Option } from "../entities";
import { option } from "../tables/question.table";
import { Effect, pipe } from "effect";
import { logger } from "../../config/logger";
import { eq } from "drizzle-orm";

export abstract class OptionRepository {
    static async create(data: TCreateOptionDto): Promise<Option> {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    const optionCreated = await drizzle.insert(option).values({
                        ...data,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }).returning();

                    logger.info(`Option created: ${optionCreated[0]}`);

                    return optionCreated[0];
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((option) => option),
            Effect.runPromise,
        )
    }

    static async findById(id: string): Promise<Option | null> {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    const optionFound = await drizzle.select().from(option).where(eq(option.id, id));
                    logger.info(`Option found: ${optionFound[0]}`);
                    return optionFound[0] || null;
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((optionFound) => optionFound),
            Effect.runPromise,
        )
    }

    static async findByQuestionId(questionId: string): Promise<Option[]> {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    const optionsFound = await drizzle.select().from(option).where(eq(option.questionId, questionId));
                    logger.info(`Options found for question: ${questionId}`);
                    return optionsFound;
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((optionsFound) => optionsFound),
            Effect.runPromise,
        )
    }

    static async findAll(): Promise<Option[]> {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    const optionsFound = await drizzle.select().from(option);
                    logger.info(`Options found: ${optionsFound.length}`);
                    return optionsFound;
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((optionsFound) => optionsFound),
            Effect.runPromise,
        )
    }

    static async update(id: string, data: TUpdateOptionDto): Promise<Option> {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    const optionUpdated = await drizzle.update(option).set({
                        ...data,
                        updatedAt: new Date(),
                    }).where(eq(option.id, id)).returning();
                    logger.info(`Option updated: ${optionUpdated[0]}`);
                    return optionUpdated[0];
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((optionUpdated) => optionUpdated),
            Effect.runPromise,
        )
    }

    static async delete(id: string): Promise<void> {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    await drizzle.delete(option).where(eq(option.id, id));
                    logger.info(`Option deleted: ${id}`);
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

