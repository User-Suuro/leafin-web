# ---- Build Stage ----
ARG NODE_VERSION=22.17.1
FROM node:${NODE_VERSION}-alpine AS builder

# Install required system packages
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy dependency manifests first for better caching
COPY package.json yarn.lock* ./

# Install ALL dependencies for build (including devDependencies)
RUN --mount=type=cache,id=s/d7fd1032-c073-4380-9115-7a1f24e5fdee-/root/cache/yarn,target=/root/.cache/yarn \
    yarn install --frozen-lockfile

# Copy all source files
COPY . .

# Build Next.js app
RUN yarn build

# ---- Production Stage ----
FROM node:${NODE_VERSION}-alpine AS production

# Install required system packages
RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package.json yarn.lock* ./

# Install only production dependencies
RUN --mount=type=cache,id=s/d7fd1032-c073-4380-9115-7a1f24e5fdee-/root/cache/yarn,target=/root/.cache/yarn \
    yarn install --frozen-lockfile --production && yarn cache clean

# Copy built application and source files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

# Copy source directories (in case they're needed at runtime)
COPY --from=builder /app/app ./app
COPY --from=builder /app/pages ./pages
COPY --from=builder /app/src ./src

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use next start instead of standalone
CMD ["yarn", "start"]