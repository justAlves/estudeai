import { Effect } from "effect";
import { AMQP, AMQPLive } from "./config/amqp";
import { LoggerService, LoggerLive } from "./config/logger";
import { Drizzle, DrizzleLive } from "./config/drizzle";
import { ai, generateQuestionsPrompt, generateCorrectionPrompt } from "./config/gemini";
import type { Message } from "./types/message.type";
import type { Option, Question, Simulado } from "./types/simulado.type";
import { simulado } from "./shared/tables/simulado.table";
import { question as questionTable } from "./shared/tables/question.table";
import { option as optionTable } from "./shared/tables/question.table";
import { redacao } from "./shared/tables/redacao.table";
import { redacaoCorrection } from "./shared/tables/redacaoCorrection.table";
import { eq } from "drizzle-orm";

type CorrectionResult = {
    competencia1: number;
    competencia2: number;
    competencia3: number;
    competencia4: number;
    competencia5: number;
    totalScore: number;
    feedback: string;
    feedbackPorCompetencia: {
        competencia1: string;
        competencia2: string;
        competencia3: string;
        competencia4: string;
        competencia5: string;
    };
};

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

        // Processar mensagens de geração de questões
        if (messageData.type === "generate_questions" || (!messageData.type && messageData.simuladoId)) {
            try {
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: [generateQuestionsPrompt(messageData.count || 0, messageData.subject || "", messageData.bank || "", "")],
                    config: {
                        responseMimeType: "application/json",
                        temperature: 0.2,
                        topP: 0.95,
                        topK: 40,
                    }
                });

                const jsonOutput = JSON.parse(response?.text?.trim() || "{}") as Simulado;
                
                await drizzle.db.update(simulado).set({
                    bank: jsonOutput.bank,
                    title: jsonOutput.title,
                    subject: jsonOutput.subject,
                    description: jsonOutput.description,
                    status: 'waiting_response',
                }).where(eq(simulado.id, messageData.simuladoId!)).returning();

                await Promise.all(jsonOutput.questions.map(async (question: Question) => {
                    const questionCreated = await drizzle.db.insert(questionTable).values({
                        simuladoId: messageData.simuladoId!,
                        question: question.question,
                        correctAnswer: question.correctAnswer,
                        order: question.order,
                        explanation: question.explanation,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }).returning();

                    await Promise.all(question.options.map(async (option: Option) => {
                        await drizzle.db.insert(optionTable).values({
                            questionId: questionCreated[0]?.id as string,
                            letter: option.letter,
                            text: option.text,
                            explanation: option.explanation,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        }).returning();
                    }));
                }));

                logger.logger.info({ simuladoId: messageData.simuladoId }, "✅ Simulado processado com sucesso");
            } catch (error) {
                logger.logger.error({ error, simuladoId: messageData.simuladoId }, "❌ Erro ao processar simulado");
            }
        }

        // Processar mensagens de correção de redação
        if (messageData.type === "correct_redacao" && messageData.redacaoId) {
            try {
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: [generateCorrectionPrompt(messageData.content || "", messageData.theme || "", messageData.bank)],
                    config: {
                        responseMimeType: "application/json",
                        temperature: 0.2,
                        topP: 0.95,
                        topK: 40,
                    }
                });

                const correctionResult = JSON.parse(response?.text?.trim() || "{}") as CorrectionResult;

                // Salvar correção no banco
                await drizzle.db.insert(redacaoCorrection).values({
                    redacaoId: messageData.redacaoId,
                    competencia1: correctionResult.competencia1,
                    competencia2: correctionResult.competencia2,
                    competencia3: correctionResult.competencia3,
                    competencia4: correctionResult.competencia4,
                    competencia5: correctionResult.competencia5,
                    totalScore: correctionResult.totalScore,
                    feedback: correctionResult.feedback,
                    feedbackPorCompetencia: correctionResult.feedbackPorCompetencia,
                    createdAt: new Date(),
                }).returning();

                // Atualizar status da redação
                await drizzle.db.update(redacao).set({
                    status: "corrected",
                    correctedAt: new Date(),
                    updatedAt: new Date(),
                }).where(eq(redacao.id, messageData.redacaoId)).returning();

                logger.logger.info({ redacaoId: messageData.redacaoId }, "✅ Redação corrigida com sucesso");
            } catch (error) {
                logger.logger.error({ error, redacaoId: messageData.redacaoId }, "❌ Erro ao corrigir redação");
                
                // Marcar como erro no banco
                try {
                    await drizzle.db.update(redacao).set({
                        status: "error",
                        updatedAt: new Date(),
                    }).where(eq(redacao.id, messageData.redacaoId)).returning();
                } catch (updateError) {
                    logger.logger.error({ error: updateError }, "❌ Erro ao atualizar status da redação");
                }
            }
        }
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
