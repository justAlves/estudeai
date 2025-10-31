FROM oven/bun:1 AS build

WORKDIR /app

# Copy root package.json and bun.lock for monorepo setup
COPY package.json bun.lock ./
COPY turbo.json ./

# Copy packages directory for shared dependencies
COPY packages/ ./packages/

# Copy the specific app
COPY apps/worker/ ./apps/worker/

# Install dependencies for the entire monorepo
RUN bun install

FROM oven/bun:1-slim AS release

WORKDIR /app

# Copy node_modules from build stage
COPY --from=build /app/node_modules ./node_modules

# Copy the Worker app
COPY --from=build /app/apps/worker ./apps/worker

# Copy shared packages
COPY --from=build /app/packages ./packages

# Copy root files
COPY --from=build /app/package.json .
COPY --from=build /app/turbo.json .

# Set working directory to the Worker app
WORKDIR /app/apps/worker

EXPOSE 8080

CMD ["bun", "run", "index.ts"]

