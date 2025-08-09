# ----------- Configurable Node version -----------
ARG NODE_VERSION=20.11.1

# ----------- Alpine Base Image -----------
FROM node:${NODE_VERSION}-alpine AS alpine
RUN apk update && apk add --no-cache libc6-compat

# ----------- Base with PNPM & Turbo -----------
FROM alpine AS base
RUN npm install pnpm turbo --global --no-cache
RUN pnpm config set store-dir /root/.local/share/pnpm/store/v3

# ----------- Turbo Prune Stage -----------
FROM base AS pruner
# Change PROJECT to your Next.js app folder in the monorepo (e.g., web, frontend, site)
ARG PROJECT=web
WORKDIR /app
COPY . .
RUN turbo prune --scope=${PROJECT} --docker

# ----------- Builder Stage -----------
FROM base AS builder
ARG PROJECT=web
ARG RAILWAY_SERVICE_ID
WORKDIR /app

# Copy pruned lockfile and package manifests
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

# Install dependencies with PNPM cache mount
RUN --mount=type=cache,id=cache:${RAILWAY_SERVICE_ID}-pnpm,target=/root/.local/share/pnpm/store/v3 \
    pnpm install --frozen-lockfile

# Copy pruned full source
COPY --from=pruner /app/out/full/ .

# Build only the Next.js app
RUN turbo build --filter=${PROJECT}

# Remove dev dependencies
RUN --mount=type=cache,id=cache:${RAILWAY_SERVICE_ID}-pnpm,target=/root/.local/share/pnpm/store/v3 \
    pnpm prune --prod --no-optional

# ----------- Runner Stage -----------
FROM alpine AS runner
ARG PROJECT=web

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nodejs
USER nodejs

WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app .

# Set working directory to the Next.js app
WORKDIR /app/apps/${PROJECT}

# Environment variables from Railway will be available automatically
ENV NODE_ENV=production

# Use Railway's PORT (default to 3000 if unset)
ENV PORT=${PORT:-3000}
EXPOSE ${PORT}

# Start Next.js
CMD ["pnpm", "start"]
