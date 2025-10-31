import { betterAuth } from "better-auth";
import { admin, openAPI } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "./db"; // your drizzle instance
import { schema } from "../shared/tables/schema";
import { env } from "./env";

export const auth = betterAuth({
  database: drizzleAdapter(drizzle, {
    provider: "pg",
    schema: schema
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
    }
  },
  session: {
    expiresIn: 7 * 24 * 60 * 60,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
    }
  },
  plugins: [
    admin(),
    openAPI()
  ], 
  trustedOrigins: [
    "http://localhost:5173", // Your frontend URL
    "https://estudyai.com.br" // Your production URL
  ]
});

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema())

export const OpenAPI = {
    getPaths: (prefix = '/auth/api') =>
        getSchema().then(({ paths }) => {
            const reference: typeof paths = Object.create(null)

            for (const path of Object.keys(paths)) {
                const key = prefix + path
                reference[key] = paths[path]

                for (const method of Object.keys(paths[path])) {
                    const operation = (reference[key] as any)[method]

                    operation.tags = ['Better Auth']
                }
            }

            return reference
        }) as Promise<any>,
    components: getSchema().then(({ components }) => components) as Promise<any>
} as const