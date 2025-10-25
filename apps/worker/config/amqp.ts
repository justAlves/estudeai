import { Effect, Context, Layer } from "effect";
import { connect } from "amqplib";
import { env } from "./env";

export class AMQPError {
    readonly _tag = "AMQPError";
    constructor(readonly error: unknown) {}
}

export class AMQP extends Context.Tag("AMQP")<
    AMQP,
    {
        readonly consume: (queue: string, onMessage: (msg: string) => void) => Effect.Effect<void, AMQPError>;
    }
>() {}

export const makeAMQP = Effect.gen(function* () {
    const connection = yield* Effect.tryPromise({
        try: () => connect(env.AMQP_URL),
        catch: (error) => new AMQPError(error),
    });

    const channel = yield* Effect.tryPromise({
        try: () => connection.createChannel(),
        catch: (error) => new AMQPError(error),
    });

    yield* Effect.tryPromise({
        try: () => channel.assertQueue("estudeai"),
        catch: (error) => new AMQPError(error),
    });

    const consume = (queue: string, onMessage: (msg: string) => void) =>
        Effect.tryPromise({
            try: async () => {
                await channel.consume(queue, (msg) => {
                    if (msg) {
                        const content = msg.content.toString();
                        onMessage(content);
                        channel.ack(msg);
                    }
                });
            },
            catch: (error) => new AMQPError(error),
        });

    return { consume };
});

export const AMQPLive = Layer.effect(AMQP, makeAMQP);

