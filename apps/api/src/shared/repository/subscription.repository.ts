import { drizzle } from "../../config/db";
import { Subscription, UsageTracking } from "../entities";
import { subscription } from "../tables/subscription.table";
import { usageTracking } from "../tables/usageTracking.table";
import { Effect, pipe } from "effect";
import { logger } from "../../config/logger";
import { eq, and, gte, lte } from "drizzle-orm";
import { sql } from "drizzle-orm";

export abstract class SubscriptionRepository {
  static async findByStripeCustomerId(
    stripeCustomerId: string,
  ): Promise<Subscription | null> {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const result = await drizzle
            .select()
            .from(subscription)
            .where(eq(subscription.stripeCustomerId, stripeCustomerId))
            .limit(1);

          return result[0] || null;
        },
        catch: (error) => {
          logger.error(error);
          throw new Error(error instanceof Error ? error.message : String(error));
        },
      }),
      Effect.map((sub) => sub),
      Effect.runPromise,
    );
  }

  static async findByUserId(userId: string): Promise<Subscription | null> {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const result = await drizzle
            .select()
            .from(subscription)
            .where(eq(subscription.userId, userId))
            .limit(1);

          return result[0] || null;
        },
        catch: (error) => {
          logger.error(error);
          throw new Error(error instanceof Error ? error.message : String(error));
        },
      }),
      Effect.map((sub) => sub),
      Effect.runPromise,
    );
  }

  static async create(data: {
    userId: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    stripePriceId: string;
    status: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
  }): Promise<Subscription> {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const result = await drizzle
            .insert(subscription)
            .values({
              userId: data.userId,
              stripeCustomerId: data.stripeCustomerId,
              stripeSubscriptionId: data.stripeSubscriptionId,
              stripePriceId: data.stripePriceId,
              status: data.status,
              currentPeriodStart: data.currentPeriodStart,
              currentPeriodEnd: data.currentPeriodEnd,
              cancelAtPeriodEnd: false,
            })
            .returning();

          return result[0];
        },
        catch: (error) => {
          logger.error(error);
          throw new Error(error instanceof Error ? error.message : String(error));
        },
      }),
      Effect.map((sub) => sub),
      Effect.runPromise,
    );
  }

  static async updateByUserId(
    userId: string,
    data: Partial<{
      stripeSubscriptionId: string;
      stripePriceId: string;
      status: string;
      currentPeriodStart: Date;
      currentPeriodEnd: Date;
      cancelAtPeriodEnd: boolean;
    }>,
  ): Promise<Subscription | null> {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const result = await drizzle
            .update(subscription)
            .set({
              ...data,
              updatedAt: new Date(),
            })
            .where(eq(subscription.userId, userId))
            .returning();

          return result[0] || null;
        },
        catch: (error) => {
          logger.error(error);
          throw new Error(error instanceof Error ? error.message : String(error));
        },
      }),
      Effect.map((sub) => sub),
      Effect.runPromise,
    );
  }

  static async cancelAtPeriodEnd(userId: string): Promise<Subscription | null> {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const result = await drizzle
            .update(subscription)
            .set({
              cancelAtPeriodEnd: true,
              updatedAt: new Date(),
            })
            .where(eq(subscription.userId, userId))
            .returning();

          return result[0] || null;
        },
        catch: (error) => {
          logger.error(error);
          throw new Error(error instanceof Error ? error.message : String(error));
        },
      }),
      Effect.map((sub) => sub),
      Effect.runPromise,
    );
  }
}

export abstract class UsageTrackingRepository {
  /**
   * Obtém o início da semana (segunda-feira) para uma data
   */
  static getWeekStart(date: Date = new Date()): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // ajusta para segunda-feira
    return new Date(d.setDate(diff));
  }

  /**
   * Obtém a data de início da semana como string YYYY-MM-DD
   */
  static getWeekStartString(date: Date = new Date()): string {
    const weekStart = this.getWeekStart(date);
    return weekStart.toISOString().split("T")[0];
  }

  static async getUsage(
    userId: string,
    type: "simulado" | "redacao",
  ): Promise<UsageTracking | null> {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const weekStart = this.getWeekStartString();
          const result = await drizzle
            .select()
            .from(usageTracking)
            .where(
              and(
                eq(usageTracking.userId, userId),
                eq(usageTracking.type, type),
                eq(usageTracking.weekStart, weekStart),
              ),
            )
            .limit(1);

          return result[0] || null;
        },
        catch: (error) => {
          logger.error(error);
          throw new Error(error instanceof Error ? error.message : String(error));
        },
      }),
      Effect.map((usage) => usage),
      Effect.runPromise,
    );
  }

  static async incrementUsage(
    userId: string,
    type: "simulado" | "redacao",
  ): Promise<UsageTracking> {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const weekStart = this.getWeekStartString();
          const existing = await this.getUsage(userId, type);

          if (existing) {
            const result = await drizzle
              .update(usageTracking)
              .set({
                count: sql`${usageTracking.count} + 1`,
                updatedAt: new Date(),
              })
              .where(eq(usageTracking.id, existing.id))
              .returning();

            return result[0];
          } else {
            const result = await drizzle
              .insert(usageTracking)
              .values({
                userId,
                type,
                weekStart,
                count: 1,
              })
              .returning();

            return result[0];
          }
        },
        catch: (error) => {
          logger.error(error);
          throw new Error(error instanceof Error ? error.message : String(error));
        },
      }),
      Effect.map((usage) => usage),
      Effect.runPromise,
    );
  }

  static async getUsageCount(
    userId: string,
    type: "simulado" | "redacao",
  ): Promise<number> {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const usage = await this.getUsage(userId, type);
          return usage?.count || 0;
        },
        catch: (error) => {
          logger.error(error);
          throw new Error(error instanceof Error ? error.message : String(error));
        },
      }),
      Effect.map((count) => count),
      Effect.runPromise,
    );
  }
}

