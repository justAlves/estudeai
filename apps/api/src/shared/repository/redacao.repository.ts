import { drizzle } from "../../config/db";
import { TCreateRedacaoDto, TUpdateRedacaoDto } from "../dto/redacao.dto";
import { Redacao, RedacaoWithCorrection } from "../entities";
import { redacao } from "../tables/redacao.table";
import { redacaoCorrection } from "../tables/redacaoCorrection.table";
import { Effect, pipe } from "effect";
import { logger } from "../../config/logger";
import { desc, eq } from "drizzle-orm";

export abstract class RedacaoRepository {
    static async create(data: TCreateRedacaoDto, userId: string): Promise<Redacao> {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    logger.info(`Creating redacao: ${JSON.stringify(data)}`);

                    const redacaoCreated = await drizzle.insert(redacao).values({
                        title: data.title,
                        theme: data.theme,
                        content: data.content,
                        bank: data.bank,
                        userId,
                    }).returning();

                    logger.info(`Redacao created: ${redacaoCreated[0]}`);

                    return redacaoCreated[0];
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((redacao) => redacao),
            Effect.runPromise,
        );
    }

    static async findById(id: string): Promise<RedacaoWithCorrection | null> {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    const redacaoFound = await drizzle.select({
                        redacao: redacao,
                        correction: redacaoCorrection,
                    })
                        .from(redacao)
                        .where(eq(redacao.id, id))
                        .leftJoin(redacaoCorrection, eq(redacao.id, redacaoCorrection.redacaoId));

                    if (redacaoFound.length === 0) {
                        return null;
                    }

                    const redacaoData = redacaoFound[0].redacao;
                    const correction = redacaoFound[0].correction;

                    logger.info(`Redacao found: ${redacaoData.id} with correction: ${correction ? "yes" : "no"}`);

                    return {
                        ...redacaoData,
                        correction: correction || null,
                    };
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((redacaoFound) => redacaoFound),
            Effect.runPromise,
        );
    }

    static async findAll(userId: string): Promise<Redacao[]> {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    const redacoesFound = await drizzle.select()
                        .from(redacao)
                        .where(eq(redacao.userId, userId))
                        .orderBy(desc(redacao.createdAt));

                    logger.info(`Found ${redacoesFound.length} redacoes for user ${userId}`);

                    return redacoesFound;
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.runPromise,
        );
    }

    static async update(id: string, data: TUpdateRedacaoDto): Promise<Redacao> {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    // Filtrar campos undefined para não sobrescrever com undefined
                    const updateData: Partial<typeof data> = {};
                    if (data.title !== undefined) updateData.title = data.title;
                    if (data.theme !== undefined) updateData.theme = data.theme;
                    if (data.content !== undefined) updateData.content = data.content;
                    if (data.bank !== undefined) updateData.bank = data.bank;
                    if (data.status !== undefined) updateData.status = data.status;

                    const redacaoUpdated = await drizzle.update(redacao)
                        .set({ ...updateData, updatedAt: new Date() })
                        .where(eq(redacao.id, id))
                        .returning();
                    
                    logger.info(`Redacao updated: ${JSON.stringify(redacaoUpdated[0])}`);
                    return redacaoUpdated[0];
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((redacaoUpdated) => redacaoUpdated),
            Effect.runPromise,
        );
    }

    static async delete(id: string): Promise<void> {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    await drizzle.delete(redacao).where(eq(redacao.id, id));
                    logger.info(`Redacao deleted: ${id}`);
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

