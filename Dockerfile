# Use build arguments for Node version
ARG NODE_VERSION=22.17.1

# ---------------- Build Stage ----------------
FROM node:${NODE_VERSION}-alpine AS builder

# Install required system libraries
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Set NODE_ENV to production early
ENV NODE_ENV=production

# Ensure yarn is up to date
RUN corepack enable && yarn set version stable

# Copy only dependency files first for better caching
COPY package.json yarn.lock ./

# Install dependencies with cache mount
RUN --mount=type=cache,id=yarn-cache,target=/root/.cache/yarn \
    yarn install --frozen-lockfile --prefer-offline --production=false

# Copy all project files
COPY . .

# Build the application (NODE_ENV=production ensures optimized build)
RUN yarn build

# Clean up dev dependencies after build
RUN yarn install --frozen-lockfile --prefer-offline --production=true && yarn cache clean

# ---------------- Production Stage ----------------
FROM node:${NODE_VERSION}-alpine AS runner

RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV=production

# Create nextjs user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["yarn", "start"]