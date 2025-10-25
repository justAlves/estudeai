import z from "zod";

const envSchema = z.object({
    AMQP_URL: z.string(),
    DATABASE_URL: z.string(),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
})

export const env = envSchema.parse(process.env)

