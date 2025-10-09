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
    GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
})

export const env = envSchema.parse(process.env)