import { SimuladoRepository } from "../../shared/repository/simulado.repository";
import { QuestionRepository } from "../../shared/repository/question.repository";
import { OptionRepository } from "../../shared/repository/option.repository";
import { CreateSimuladoDto } from "../../shared/dto/simulado.dto";
import { Simulado, User } from "../../shared/entities";
import { ai } from "../../config/gemini";
import { logger } from "../../config/logger";
import Elysia, { t } from "elysia";
import { user } from "../../shared/tables/user.table";
import { Effect, pipe } from "effect";
import z from "zod";
import { amqp } from "../../config/amqp";
import { SimuladoService } from "./service";
import { SubscriptionService } from "../subscription/service";

const prompt = (count: number, subject: string, bank: string, context: string) => `
    Você é um gerador de questões altamente especializado para concursos públicos
    e vestibular, com foco em precisão e aderência ao estilo da banca.

    Você deve gerar ${count} questões de múltipla escolha sobre o tema ${subject}.
    O estilo das questões devem simular as questões da banca ${bank}.

    As questões devem ser geradas em português brasileiro e no formato de múltipla escolha.
    As questões devem ser geradas com 4 opções de resposta, sendo uma correta e três incorretas.
    
    Contexto de Apoio:
    Use as seguintes questões de referência para guiar o estilo e o nível de profundidade:
    """
    ${context}
    """

    A saída DEVE ser em JSON no seguinte formato:
    {
        "title": "Título do Simulado",
        "bank": "Banca do Simulado",
        "description": "Descrição do Simulado",
        "subject": "Tema do Simulado",
        "questions": [
            {
                "question": "Questão",
                "correctAnswer": "Resposta Correta, letra (A, B, C, D)",
                "order": "Ordem da Questão (1, 2, 3, 4)",
                "explanation": "Explicação da Questão",
                "options": [
                    {
                        "letter": "A",
                        "text": "Opção A",
                        "explanation": "Explicação da Opção A, porque ela é a correta ou incorreta"
                    },
                    {
                        "letter": "B",
                        "text": "Opção B",
                        "explanation": "Explicação da Opção B, porque ela é a correta ou incorreta"
                    },
                    {
                        "letter": "C",
                        "text": "Opção C",
                        "explanation": "Explicação da Opção C, porque ela é a correta ou incorreta"
                    },
                    {
                        "letter": "D",
                        "text": "Opção D",
                        "explanation": "Explicação da Opção D, porque ela é a correta ou incorreta"
                    }
                ]
            }
        ]
    }

    Não inclua nenhum outro texto além do JSON, nem explicações, nem comentários, nem nada além do JSON.
`

export const simuladoController = new Elysia({ prefix: "/simulado" })
    .decorate("user", null as unknown as User)
    .post("/generate", async ({ body, user, set }) => {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    // Verificar limites antes de criar
                    const canCreate = await SubscriptionService.canCreateSimulado(user.id);
                    
                    if (!canCreate.allowed) {
                        set.status = 403;
                        throw new Error(canCreate.reason || "Limite atingido");
                    }

                    await SimuladoService.create({
                        count: body.count,
                        subject: body.subject,
                        bank: body.bank,
                        title: body.title,
                        description: body.description,
                    }, user.id);

                    // Incrementar uso após criar com sucesso
                    await SubscriptionService.incrementSimuladoUsage(user.id);

                    return {
                        message: "Enviado a fila de processamento!",
                    }
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((result) => result),
            Effect.runPromise,
        )
    }, {
        // Add timeout configuration
        detail: {
            description: "Generate a new simulado using AI",
            tags: ["simulado"]
        },
        body: t.Object({
            count: t.Number(),
            subject: t.String(),
            bank: t.String(),
            title: t.String({ default: "" }),
            description: t.String({ default: "" }),
        }),
        auth: true,
    })
    .get("/", async ({ user }) => {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    return await SimuladoService.findAll(user.id);
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((result) => result),
            Effect.runPromise,
        )
    }, {
        detail: {
            description: "Get all simulados",
            tags: ["simulado"]
        },
        //@ts-ignore
        auth: true,
    })
    .get("/:id", async ({ params }) => {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    return await SimuladoService.findById(params.id);
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((result) => result),
            Effect.runPromise,
        )
    }, {
        detail: {
            description: "Get a simulado by id",
            tags: ["simulado"]
        },
        params: t.Object({
            id: t.String(),
        }),
        //@ts-ignore
        auth: true,
    })