import { Effect, Context, Layer } from "effect";
import { pino, type Logger } from "pino";

export class LoggerService extends Context.Tag("LoggerService")<
    LoggerService,
    {
        readonly logger: Logger;
        readonly info: (msg: string, obj?: object) => Effect.Effect<void>;
        readonly error: (msg: string, obj?: object) => Effect.Effect<void>;
        readonly warn: (msg: string, obj?: object) => Effect.Effect<void>;
        readonly debug: (msg: string, obj?: object) => Effect.Effect<void>;
    }
>() {}

export const makeLogger = Effect.sync(() => {
    const logger = pino({
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true,
            },
        },
    });

    return {
        logger,
        info: (msg: string, obj?: object) =>
            Effect.sync(() => logger.info(obj ?? {}, msg)),
        error: (msg: string, obj?: object) =>
            Effect.sync(() => logger.error(obj ?? {}, msg)),
        warn: (msg: string, obj?: object) =>
            Effect.sync(() => logger.warn(obj ?? {}, msg)),
        debug: (msg: string, obj?: object) =>
            Effect.sync(() => logger.debug(obj ?? {}, msg)),
    };
});

export const LoggerLive = Layer.effect(LoggerService, makeLogger);
