import { connect } from "amqplib";
import { env } from "./env";

export const amqp = {
    connect: async () => {
        const connection = await connect(env.AMQP_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue("estudeai");
        return channel;
    },
    sendMessage: async (message: string) => {
        const channel = await amqp.connect();
        channel.sendToQueue("estudeai", Buffer.from(message));
    }
}