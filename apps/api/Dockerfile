FROM node:20-alpine AS build

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy root package files for monorepo setup
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./

# Copy packages directory for shared dependencies
COPY packages/ ./packages/

# Copy the specific app
COPY apps/api/ ./apps/api/

# Install dependencies for the entire monorepo
RUN pnpm install --frozen-lockfile

FROM oven/bun:1-slim AS release

WORKDIR /app

# Copy node_modules from build stage
COPY --from=build /app/node_modules ./node_modules

# Copy the API app
COPY --from=build /app/apps/api ./apps/api

# Copy shared packages
COPY --from=build /app/packages ./packages

# Copy root files
COPY --from=build /app/package.json .
COPY --from=build /app/pnpm-workspace.yaml .
COPY --from=build /app/turbo.json .

# Set working directory to the API app
WORKDIR /app/apps/api

EXPOSE 3000

# Run with Bun for better performance
CMD ["bun", "run", "src/index.ts"]