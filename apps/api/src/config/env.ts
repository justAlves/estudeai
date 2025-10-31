import z from "zod";

const envSchema = z.object({
    BETTER_AUTH_SECRET: z.string(),
    DATABASE_URL: z.string(),
    FRONTEND_URL: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    R2_ACCESS_KEY: z.string(),
    R2_ENDPOINT: z.string(),
    R2_SECRET: z.string(),
    RESEND_API_KEY: z.string(),
    AXIOM_TOKEN: z.string(),
    REDIRECT_URI: z.string(),
    BETTER_AUTH_URL: z.string(),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
    AMQP_URL: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
    STRIPE_PRICE_ID: z.string(),
})

export const env = envSchema.parse(process.env)