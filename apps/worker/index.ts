import { Effect } from "effect";
import { AMQP, AMQPLive } from "./config/amqp";
import { LoggerService, LoggerLive } from "./config/logger";
import { Drizzle, DrizzleLive } from "./config/drizzle";
import { ai, generateQuestionsPrompt } from "./config/gemini";
import type { Message } from "./types/message.type";
import type { Option, Question, Simulado } from "./types/simulado.type";
import { simulado } from "./shared/tables/simulado.table";
import { question as questionTable } from "./shared/tables/question.table";
import { option as optionTable } from "./shared/tables/question.table";
import { eq } from "drizzle-orm";

const program = Effect.gen(function* () {
    const logger = yield* LoggerService;
    const amqp = yield* AMQP;
    const drizzle = yield* Drizzle;
    
    yield* logger.info("🚀 Worker iniciado!");
    yield* logger.info("📡 Conectado ao RabbitMQ");
    yield* logger.info("👂 Aguardando mensagens na fila 'estudeai'...");

    yield* amqp.consume("estudeai", async (message: string) => {
        const messageData = JSON.parse(message) as Message;
        logger.logger.info({
            message: messageData,
            timestamp: new Date().toISOString(),
        }, "📨 Nova mensagem recebida:");

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [generateQuestionsPrompt(messageData.count, messageData.subject, messageData.bank, "")],
            config: {
                responseMimeType: "application/json",
                temperature: 0.2,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 8096,
            }
        });

        const jsonOutput = JSON.parse(response?.text?.trim() || "{}") as Simulado;
        
        await drizzle.db.update(simulado).set({
            bank: jsonOutput.bank,
            title: jsonOutput.title,
            subject: jsonOutput.subject,
            description: jsonOutput.description,
            status: 'waiting_response',
        }).where(eq(simulado.id, messageData.simuladoId)).returning();


        await Promise.all(jsonOutput.questions.map(async (question: Question) => {
            const questionCreated = await drizzle.db.insert(questionTable).values({
                simuladoId: messageData.simuladoId,
                question: question.question,
                correctAnswer: question.correctAnswer,
                order: question.order,
                createdAt: new Date(),
                updatedAt: new Date(),
            }).returning();

            await Promise.all(question.options.map(async (option: Option) => {
                await drizzle.db.insert(optionTable).values({
                    questionId: questionCreated[0]?.id as string,
                    letter: option.letter,
                    text: option.text,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }).returning();
            }));
        }));
    });   

    yield* Effect.never;
});

const runnable = program.pipe(
    Effect.catchAll((error) =>
        Effect.gen(function* () {
            const logger = yield* LoggerService;
            yield* logger.error("❌ Erro fatal no worker:", {
                error: error._tag === "AMQPError" ? error.error : error,
            });
            return yield* Effect.fail(error);
        })
    ),
    Effect.provide(LoggerLive),
    Effect.provide(AMQPLive),
    Effect.provide(DrizzleLive)
);

Effect.runPromise(runnable).catch((error) => {
    console.error("Failed to start worker:", error);
    process.exit(1);
});
