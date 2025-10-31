import { RedacaoService } from "./service";
import { User } from "../../shared/entities";
import { logger } from "../../config/logger";
import Elysia, { t } from "elysia";
import { Effect, pipe } from "effect";
import { SubscriptionService } from "../subscription/service";

export const redacaoController = new Elysia({ prefix: "/redacao" })
    .decorate("user", null as unknown as User)
    .post("/", async ({ body, user, set }) => {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    // Se vai enviar para correção, verificar limites
                    if (body.sendForCorrection) {
                        const canSend = await SubscriptionService.canSendRedacao(user.id);
                        
                        if (!canSend.allowed) {
                            set.status = 403;
                            throw new Error(canSend.reason || "Limite atingido");
                        }
                    }

                    const redacao = await RedacaoService.create({
                        title: body.title,
                        theme: body.theme,
                        content: body.content,
                        bank: body.bank,
                    }, user.id, body.sendForCorrection || false);

                    // Incrementar uso após enviar para correção com sucesso
                    if (body.sendForCorrection) {
                        await SubscriptionService.incrementRedacaoUsage(user.id);
                    }

                    return redacao;
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((result) => result),
            Effect.runPromise,
        );
    }, {
        detail: {
            description: "Create a new redacao",
            tags: ["redacao"]
        },
        body: t.Object({
            title: t.String(),
            theme: t.String(),
            content: t.String(),
            bank: t.String(),
            sendForCorrection: t.Optional(t.Boolean()),
        }),
        auth: true,
    })
    .post("/:id/send-for-correction", async ({ params, user, set }) => {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    // Verificar limites antes de enviar
                    const canSend = await SubscriptionService.canSendRedacao(user.id);
                    
                    if (!canSend.allowed) {
                        set.status = 403;
                        throw new Error(canSend.reason || "Limite atingido");
                    }

                    const redacao = await RedacaoService.sendForCorrection(params.id);

                    // Incrementar uso após enviar com sucesso
                    await SubscriptionService.incrementRedacaoUsage(user.id);

                    return redacao;
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((result) => result),
            Effect.runPromise,
        );
    }, {
        detail: {
            description: "Send redacao for correction",
            tags: ["redacao"]
        },
        params: t.Object({
            id: t.String(),
        }),
        //@ts-ignore
        auth: true,
    })
    .get("/", async ({ user }) => {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    return await RedacaoService.findAll(user.id);
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((result) => result),
            Effect.runPromise,
        );
    }, {
        detail: {
            description: "Get all redacoes for the authenticated user",
            tags: ["redacao"]
        },
        //@ts-ignore
        auth: true,
    })
    .get("/:id", async ({ params }) => {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    return await RedacaoService.findById(params.id);
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((result) => result),
            Effect.runPromise,
        );
    }, {
        detail: {
            description: "Get a redacao by id",
            tags: ["redacao"]
        },
        params: t.Object({
            id: t.String(),
        }),
        //@ts-ignore
        auth: true,
    })
    .put("/:id", async ({ params, body }) => {
        return pipe(
            Effect.tryPromise({
                try: async () => {
                    return await RedacaoService.update(params.id, {
                        title: body.title,
                        theme: body.theme,
                        content: body.content,
                        bank: body.bank,
                    });
                },
                catch: (error) => {
                    logger.error(error);
                    throw new Error(error instanceof Error ? error.message : String(error));
                },
            }),
            Effect.map((result) => result),
            Effect.runPromise,
        );
    }, {
        detail: {
            description: "Update a redacao",
            tags: ["redacao"]
        },
        params: t.Object({
            id: t.String(),
        }),
        body: t.Object({
            title: t.Optional(t.String()),
            theme: t.Optional(t.String()),
            content: t.Optional(t.String()),
            bank: t.Optional(t.String()),
        }),
        //@ts-ignore
        auth: true,
    });

