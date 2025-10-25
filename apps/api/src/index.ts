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

const app = new Elysia()
  .use(
    cors({
      origin: ["http://localhost:5174", "https://estudyai.com.br"], // Your frontend URL
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
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
