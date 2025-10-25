import { Effect, Context, Layer } from "effect";
import { drizzle as drizzleOrm } from 'drizzle-orm/node-postgres';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { env } from './env';

export class DrizzleError {
    readonly _tag = "DrizzleError";
    constructor(readonly error: unknown) {}
}

export class Drizzle extends Context.Tag("Drizzle")<
    Drizzle,
    {
        readonly db: NodePgDatabase;
    }
>() {}

export const makeDrizzle = Effect.sync(() => {
    const db = drizzleOrm(env.DATABASE_URL);
    return { db };
});

export const DrizzleLive = Layer.effect(Drizzle, makeDrizzle);