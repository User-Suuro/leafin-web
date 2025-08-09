ARG NODE_VERSION=22.17.1

# Alpine Image
FROM node:${NODE_VERSION}-alpine AS alpine
RUN echo '1'

RUN apk update
RUN apk add --no-cache libc6-compat

# Setup PNPM and Turbo on the Alpine Image
FROM alpine as base

RUN echo '2'

RUN npm install pnpm turbo --global --no-cache
RUN pnpm config set store-dir /root/.local/share/pnpm/store/v3

# Prune Projects
FROM base AS pruner
ARG PROJECT=api

RUN echo '3'

WORKDIR /app
COPY . .
RUN turbo prune --scope=${PROJECT} --docker

# Build Project
FROM base AS builder
ARG PROJECT=api
ARG RAILWAY_SERVICE_ID=d7fd1032-c073-4380-9115-7a1f24e5fdee

RUN echo ${RAILWAY_SERVICE_ID}

WORKDIR /app

# Copy lockfile and package.json's
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

# Install Dependencies with cache-key prefix
RUN --mount=type=cache,id=cache-key:${RAILWAY_SERVICE_ID}-pnpm-store,target=/root/.local/share/pnpm/store/v3 \
    pnpm install --frozen-lockfile

# Prune production deps with same cache
RUN --mount=type=cache,id=cache-key:${RAILWAY_SERVICE_ID}-pnpm-store,target=/root/.local/share/pnpm/store/v3 \
    pnpm prune --prod --no-optional

# Copy Source Code
COPY --from=pruner /app/out/full/ .

RUN turbo build --filter=${PROJECT}
RUN --mount=type=cache,id=s/${RAILWAY_SERVICE_ID}-/root/.local/share/pnpm/store/v3,target=/root/.local/share/pnpm/store/v3 pnpm prune --prod --no-optional
RUN rm -rf ./**/*/src

# Final Image
FROM alpine AS runner
ARG PROJECT=api

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app .
WORKDIR /app/apps/${PROJECT}

ARG PORT=3000
ENV PORT=${PORT}
ENV NODE_ENV=production

EXPOSE ${PORT}

CMD node dist/server.js