import Elysia, { t } from "elysia";
import { SubscriptionService } from "./service";
import { logger } from "../../config/logger";
import { User } from "better-auth/*";
import { Effect, pipe } from "effect";
import Stripe from "stripe";
import { env } from "../../config/env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

export const subscriptionController = new Elysia({ prefix: "/subscription" })
  .decorate("user", null as unknown as User)
  // Webhook está definido no index.ts antes do CORS para garantir body raw
  .post(
    "/create-checkout-session",
    async ({ user, set }) => {
      return pipe(
        Effect.tryPromise({
          try: async () => {
            if (!user.email) {
              set.status = 400;
              throw new Error("Email do usuário não encontrado");
            }

            const result = await SubscriptionService.createCheckoutSession(
              user.id,
              user.email,
            );
            return result;
          },
          catch: (error) => {
            logger.error(error);
            set.status = 500;
            throw new Error(
              error instanceof Error ? error.message : String(error),
            );
          },
        }),
        Effect.map((result) => result),
        Effect.runPromise,
      );
    },
    {
      //@ts-ignore
      auth: true,
      detail: {
        description: "Create Stripe checkout session",
        tags: ["subscription"],
      },
    },
  )
  .get(
    "/status",
    async ({ user }) => {
      return pipe(
        Effect.tryPromise({
          try: async () => {
            return await SubscriptionService.getSubscriptionStatus(user.id);
          },
          catch: (error) => {
            logger.error(error);
            throw new Error(
              error instanceof Error ? error.message : String(error),
            );
          },
        }),
        Effect.map((result) => result),
        Effect.runPromise,
      );
    },
    {
      //@ts-ignore
      auth: true,
      detail: {
        description: "Get subscription status",
        tags: ["subscription"],
      },
    },
  )
  .post(
    "/cancel",
    async ({ user, set }) => {
      return pipe(
        Effect.tryPromise({
          try: async () => {
            await SubscriptionService.cancelSubscription(user.id);
            return { success: true };
          },
          catch: (error) => {
            logger.error(error);
            set.status = 500;
            throw new Error(
              error instanceof Error ? error.message : String(error),
            );
          },
        }),
        Effect.map((result) => result),
        Effect.runPromise,
      );
    },
    {
      //@ts-ignore
      auth: true,
      detail: {
        description: "Cancel subscription",
        tags: ["subscription"],
      },
    },
  )
  .get(
    "/usage",
    async ({ user }) => {
      return pipe(
        Effect.tryPromise({
          try: async () => {
            const status = await SubscriptionService.getSubscriptionStatus(
              user.id,
            );
            return {
              simulados: status.usage?.simulados || 0,
              redacoes: status.usage?.redacoes || 0,
              isPro: status.isPro,
            };
          },
          catch: (error) => {
            logger.error(error);
            throw new Error(
              error instanceof Error ? error.message : String(error),
            );
          },
        }),
        Effect.map((result) => result),
        Effect.runPromise,
      );
    },
    {
      //@ts-ignore
      auth: true,
      detail: {
        description: "Get usage statistics",
        tags: ["subscription"],
      },
    },
  )
  .post(
    "/create-portal-session",
    async ({ user, set }) => {
      return pipe(
        Effect.tryPromise({
          try: async () => {
            const subscription = await SubscriptionService.getSubscriptionStatus(
              user.id,
            );

            if (!subscription.subscription) {
              set.status = 404;
              throw new Error("Assinatura não encontrada");
            }

            // Buscar customerId da subscription
            const { SubscriptionRepository } = await import(
              "../../shared/repository/subscription.repository"
            );
            const sub = await SubscriptionRepository.findByUserId(user.id);

            if (!sub?.stripeCustomerId) {
              set.status = 404;
              throw new Error("Customer ID não encontrado");
            }

            const result = await SubscriptionService.createPortalSession(
              sub.stripeCustomerId,
            );
            return result;
          },
          catch: (error) => {
            logger.error(error);
            set.status = 500;
            throw new Error(
              error instanceof Error ? error.message : String(error),
            );
          },
        }),
        Effect.map((result) => result),
        Effect.runPromise,
      );
    },
    {
      //@ts-ignore
      auth: true,
      detail: {
        description: "Create Stripe portal session",
        tags: ["subscription"],
      },
    },
  );

