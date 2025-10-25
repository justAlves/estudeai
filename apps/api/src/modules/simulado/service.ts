import { TCreateSimuladoDto } from "../../shared/dto/simulado.dto";
import { Effect, pipe } from "effect";
import { SimuladoRepository } from "../../shared/repository/simulado.repository";
import { logger } from "../../config/logger";
import { user } from "../../shared/tables/user.table";
import { amqp } from "../../config/amqp";

export abstract class SimuladoService {
    static async create(data: { count: number, subject: string, bank: string, title?: string, description?: string }, userId: string) {
        return pipe(
            Effect.tryPromise({
                try: async () => {

                    const title = data.title || `${data.bank} - ${data.subject}`
                    const description = data.description || ""
                    
                    const simuladoCreated = await SimuladoRepository.create({
                        title: title,
                        bank: data.bank,
                        description: description,
                        subject: data.subject,
                    }, userId);
                    amqp.sendMessage(JSON.stringify({
                        count: data.count,
                        subject: data.subject,
                        bank: data.bank,
                        userId: userId,
                        simuladoId: simuladoCreated.id
                    }))

                    logger.info(`Enviado a fila de processamento: ${JSON.stringify({
                        count: data.count,
                        subject: data.subject,
                        bank: data.bank,
                        userId: userId,
                    })}`);

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

    static async findAll(userId: string) {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    return await SimuladoRepository.findAll(userId);
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((simulados) => simulados),
            Effect.runPromise,
        )
    }

    static async findById(id: string) {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    return await SimuladoRepository.findById(id);
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
}