import { TCreateRedacaoDto } from "../../shared/dto/redacao.dto";
import { Effect, pipe } from "effect";
import { RedacaoRepository } from "../../shared/repository/redacao.repository";
import { logger } from "../../config/logger";
import { amqp } from "../../config/amqp";

export abstract class RedacaoService {
    static async create(data: TCreateRedacaoDto, userId: string, sendForCorrection: boolean = false) {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    const redacaoCreated = await RedacaoRepository.create(data, userId);
                    
                    if (sendForCorrection) {
                        // Enviar para fila de correção
                        amqp.sendMessage(JSON.stringify({
                            type: "correct_redacao",
                            redacaoId: redacaoCreated.id,
                            content: redacaoCreated.content,
                            theme: redacaoCreated.theme,
                            bank: redacaoCreated.bank,
                        }));

                        // Atualizar status para 'correcting'
                        await RedacaoRepository.update(redacaoCreated.id, { status: "correcting" });

                        logger.info(`Enviado a fila de correção: ${JSON.stringify({
                            redacaoId: redacaoCreated.id,
                            theme: redacaoCreated.theme,
                        })}`);
                    }

                    return redacaoCreated;
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

    static async sendForCorrection(id: string) {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    const redacao = await RedacaoRepository.findById(id);
                    if (!redacao) {
                        throw new Error("Redação não encontrada");
                    }
                    if (redacao.status === "corrected" || redacao.status === "correcting") {
                        throw new Error("Redação já está sendo corrigida ou já foi corrigida");
                    }

                    // Enviar para fila de correção
                    amqp.sendMessage(JSON.stringify({
                        type: "correct_redacao",
                        redacaoId: redacao.id,
                        content: redacao.content,
                        theme: redacao.theme,
                        bank: redacao.bank,
                    }));

                    // Atualizar status para 'correcting'
                    await RedacaoRepository.update(id, { status: "correcting" });

                    logger.info(`Enviado a fila de correção: ${JSON.stringify({
                        redacaoId: id,
                        theme: redacao.theme,
                    })}`);

                    return await RedacaoRepository.findById(id);
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

    static async findAll(userId: string) {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    return await RedacaoRepository.findAll(userId);
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((redacoes) => redacoes),
            Effect.runPromise,
        );
    }

    static async findById(id: string) {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    return await RedacaoRepository.findById(id);
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

    static async update(id: string, data: { title?: string; theme?: string; content?: string; bank?: string }) {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    // Verificar se a redação já foi corrigida
                    const redacao = await RedacaoRepository.findById(id);
                    if (!redacao) {
                        throw new Error("Redação não encontrada");
                    }
                    if (redacao.status === "corrected") {
                        throw new Error("Não é possível editar uma redação já corrigida");
                    }
                    
                    return await RedacaoRepository.update(id, data);
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
}

