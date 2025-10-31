import { Elysia } from "elysia";
import { authController } from "./modules/auth";
import { cors } from "@elysiajs/cors";
import { userController } from "./modules/user";
import { uploadController } from "./modules/upload";
import { swagger } from "@elysiajs/swagger";
import { opentelemetry } from "@elysiajs/opentelemetry";

import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { OpenAPI } from "./config/auth";
import { simuladoController } from "./modules/simulado";
import { userResponseController } from "./modules/userResponse";
import { dashboardController } from "./modules/dashboard";
import { redacaoController } from "./modules/redacao";
import { subscriptionController } from "./modules/subscription";
import { SubscriptionService } from "./modules/subscription/service";
import Stripe from "stripe";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { Effect, pipe } from "effect";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

const app = new Elysia()
  // Webhook do Stripe deve vir ANTES do CORS para não modificar o body
  // O Stripe precisa enviar diretamente sem passar por CORS
  .post("/subscription/webhook", async ({ request, set }) => {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          // Obter o corpo raw - IMPORTANTE: não parsear antes!
          // No Bun/Elysia, request.body pode ser um ReadableStream
          let body: Buffer;
          if (request.body instanceof ReadableStream) {
            const rawBody = await Bun.readableStreamToArrayBuffer(request.body);
            body = Buffer.from(rawBody);
          } else {
            // Fallback: se já for um ArrayBuffer ou outro tipo
            const rawBody = await request.arrayBuffer();
            body = Buffer.from(rawBody);
          }
          const signature = request.headers.get("stripe-signature");

          if (!signature) {
            logger.error("Missing stripe-signature header");
            set.status = 400;
            throw new Error("Missing stripe-signature header");
          }

          // Verificar se o webhook secret está configurado
          if (!env.STRIPE_WEBHOOK_SECRET) {
            logger.error("STRIPE_WEBHOOK_SECRET não está configurado");
            set.status = 500;
            throw new Error("Webhook secret não configurado");
          }

          let event: Stripe.Event;
          try {
            // Usar constructEventAsync para Bun/SubtleCryptoProvider
            event = await stripe.webhooks.constructEventAsync(
              body,
              signature,
              env.STRIPE_WEBHOOK_SECRET,
            );
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            logger.error(`Webhook signature verification failed: ${errorMsg}`);
            logger.error(`Signature present: ${!!signature}`);
            logger.error(`Body length: ${body.length}`);
            logger.error(`Webhook secret configured: ${!!env.STRIPE_WEBHOOK_SECRET}`);
            logger.error(`Webhook secret starts with: ${env.STRIPE_WEBHOOK_SECRET?.substring(0, 10)}...`);
            set.status = 400;
            throw new Error(`Webhook signature verification failed: ${errorMsg}`);
          }

          await SubscriptionService.handleWebhook(event);
          return { received: true };
        },
        catch: (error) => {
          logger.error(`Webhook error: ${error}`);
          set.status = 500;
          throw new Error(
            error instanceof Error ? error.message : String(error),
          );
        },
      }),
      Effect.map((result) => result),
      Effect.runPromise,
    );
  })
  // Responder OPTIONS para webhook (CORS preflight)
  .options("/subscription/webhook", ({ set }) => {
    set.headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "stripe-signature, Content-Type",
    };
    return "";
  })
  .use(
    cors({
      origin: ["http://localhost:5173", "https://estudyai.com.br"], // Your frontend URL
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "stripe-signature"],
    }),
  )
  .use(
    swagger({
      documentation: {
        info: {
          title: "EstudeAI API Documentation",
          version: "1.0.0",
          description:
            "This is the API documentation for the EstudeAI backend services.",
        },
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
      },
    }),
  )
  .use(
    opentelemetry({
      spanProcessors: [
        new BatchSpanProcessor(
          new OTLPTraceExporter({
            url: "https://api.axiom.co/v1/traces",
            headers: {
              Authorization: `Bearer ${Bun.env.AXIOM_TOKEN}`,
              "X-Axiom-Dataset": "estudeai",
            },
          }),
        ),
      ],
    }),
  )
  .use(authController)
  .use(userController)
  .use(uploadController)
  .use(simuladoController)
  .use(userResponseController)
  .use(dashboardController)
  .use(redacaoController)
  .use(subscriptionController)
  .get("/health", () => "Healthy")
  .listen({
    port: 3000,
    development: process.env.NODE_ENV !== "production",
    // Add timeout for requests
    maxRequestBodySize: 1024 * 1024 * 10, // 10MB
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
