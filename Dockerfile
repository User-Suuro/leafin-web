# ---- Build Stage ----
ARG NODE_VERSION=22.17.1
FROM node:${NODE_VERSION}-alpine AS builder

# Install required system packages
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy dependency manifests first for better caching
COPY package.json yarn.lock ./

# Install ALL dependencies for build (including devDependencies)
RUN --mount=type=cache,id=s/d7fd1032-c073-4380-9115-7a1f24e5fdee-/root/cache/yarn \
    yarn install --frozen-lockfile

# Copy all source files
COPY . .

# Build Next.js app
RUN yarn build

# ---- Production Stage ----
FROM node:${NODE_VERSION}-alpine AS runner

RUN apk add --no-cache libc6-compat

WORKDIR /app
ENV NODE_ENV=production

# Copy only what's needed for runtime
COPY package.json yarn.lock ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Install only production dependencies in runtime
RUN --mount=type=cache,id=s/d7fd1032-c073-4380-9115-7a1f24e5fdee-/root/cache/yarn \
    yarn install --frozen-lockfile --production=true && yarn cache clean

EXPOSE 3000
CMD ["yarn", "start"]
