# ---- Development Stage ----
ARG NODE_VERSION=22.17.1
FROM node:${NODE_VERSION}-alpine AS development

# Install required system packages
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy dependency manifests first for better caching
COPY package.json yarn.lock* ./

# Install ALL dependencies (including devDependencies for development)
RUN --mount=type=cache,id=s/d7fd1032-c073-4380-9115-7a1f24e5fdee-/root/cache/yarn,target=/root/.cache/yarn \
    yarn install --frozen-lockfile

# Copy all source files
COPY . .

EXPOSE 3000

ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Development command
CMD ["yarn", "dev"]

# ---- Build Stage ----
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

# Install required system packages and create app user for security
RUN apk add --no-cache libc6-compat && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

WORKDIR /app

ENV NODE_ENV=production

# Copy package files (needed for some runtime dependencies)
COPY package.json yarn.lock* ./

# Install only production dependencies (fallback for any runtime needs)
RUN --mount=type=cache,id=s/d7fd1032-c073-4380-9115-7a1f24e5fdee-/root/cache/yarn,target=/root/.cache/yarn \
    yarn install --frozen-lockfile --production && yarn cache clean

# Copy built application from builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Set proper ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use the standalone server for better performance
CMD ["node", "server.js"]

# ---- Default to production ----
FROM production AS runner