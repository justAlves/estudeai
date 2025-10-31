import { drizzle } from "../../config/db";
import { TCreateSimuladoDto, TUpdateSimuladoDto } from "../dto/simulado.dto";
import { Simulado, SimuladoWithQuestions, QuestionWithOptions } from "../entities";
import { simulado } from "../tables/simulado.table";
import { Effect, pipe } from "effect";
import { logger } from "../../config/logger";
import { asc, desc, eq } from "drizzle-orm";
import { option, question } from "../tables/question.table";

export abstract class SimuladoRepository {
    static async create(data: TCreateSimuladoDto, userId: string): Promise<Simulado> {
        return pipe(
            Effect.tryPromise({
                try: async () => {

                    logger.info(`Creating simulado: ${JSON.stringify(data)}`);

                    const simuladoCreated = await drizzle.insert(simulado).values({
                        title: data.title,
                        bank: data.bank,
                        description: data.description,
                        subject: data.subject,
                        userId,
                        timeToRespond: 0,
                        score: 0,
                    }).returning();

                    logger.info(`Simulado created: ${simuladoCreated[0]}`);

                    return simuladoCreated[0];
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((simulado) => simulado),
            Effect.runPromise,
        )
    }

    static async findById(id: string): Promise<SimuladoWithQuestions | null> {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    const simuladoFound = await drizzle.select({
                        simulado: simulado,
                        question: question,
                        option: option,
                    }).from(simulado)
                    .where(eq(simulado.id, id))
                    .leftJoin(question, eq(simulado.id, question.simuladoId))
                    .leftJoin(option, eq(question.id, option.questionId))
                    .orderBy(asc(question.order), asc(option.letter));

                    if (simuladoFound.length === 0) {
                        return null;
                    }

                    // Agrupar dados
                    const simuladoData = simuladoFound[0].simulado;
                    const questionsMap = new Map<string, QuestionWithOptions>();

                    for (const row of simuladoFound) {
                        if (row.question) {
                            const questionId = row.question.id;
                            
                            if (!questionsMap.has(questionId)) {
                                questionsMap.set(questionId, {
                                    ...row.question,
                                    answer: row.question.correctAnswer, // Mapear correctAnswer para answer
                                    options: [],
                                });
                            }

                            if (row.option) {
                                questionsMap.get(questionId)!.options.push(row.option);
                            }
                        }
                    }

                    const questions = Array.from(questionsMap.values());

                    logger.info(`Simulado found: ${simuladoData.id} with ${questions.length} questions`);

                    return {
                        ...simuladoData,
                        questions: questions,
                    };
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((simuladoFound) => simuladoFound),
            Effect.runPromise,
        )
    }

    static async findAll(userId: string): Promise<SimuladoWithQuestions[]> {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    const simuladoFound = await drizzle.select({
                        simulado: simulado,
                        questions: question,
                    }).from(simulado).where(eq(simulado.userId, userId)).leftJoin(question, eq(simulado.id, question.simuladoId)).orderBy(desc(simulado.createdAt));

                    // Agrupar questões por simulado
                    const simuladosMap = new Map<string, SimuladoWithQuestions>();

                    for (const row of simuladoFound) {
                        const simuladoId = row.simulado.id;
                        
                        if (!simuladosMap.has(simuladoId)) {
                            simuladosMap.set(simuladoId, {
                                ...row.simulado,
                                questions: [],
                            });
                        }

                        if (row.questions) {
                            simuladosMap.get(simuladoId)!.questions.push({
                                ...row.questions,
                                answer: row.questions.correctAnswer, // Mapear correctAnswer para answer
                                options: []
                            });
                        }
                    }

                    return Array.from(simuladosMap.values());
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.runPromise,
        )
    }

    static async update(id: string, data: TUpdateSimuladoDto): Promise<Simulado> {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    const simuladoUpdated = await drizzle.update(simulado).set(data).where(eq(simulado.id, id)).returning();
                    logger.info(`Simulado updated: ${simuladoUpdated[0]}`);
                    return simuladoUpdated[0];
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((simuladoUpdated) => simuladoUpdated),
            Effect.runPromise,
        )
    }
    static async delete(id: string): Promise<void> {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    await drizzle.delete(simulado).where(eq(simulado.id, id));
                    logger.info(`Simulado deleted: ${id}`);
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