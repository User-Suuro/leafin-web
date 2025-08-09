# Use Node 22 (same as your local machine)
FROM node:22-alpine AS deps

WORKDIR /app

# Install Corepack to manage Yarn version
RUN npm install -g corepack@0.24.1 && corepack enable

# Copy dependency files first to leverage caching
COPY package.json yarn.lock ./

# Install dependencies with a Railway-compatible cache mount
RUN --mount=type=cache,id=d7fd1032-c073-4380-9115-7a1f24e5fdee:yarn-cache,target=/usr/local/share/.cache/yarn \
    yarn install --frozen-lockfile

# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files
COPY . .

# Build application
RUN yarn build

# Production image
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built app
COPY --from=builder /app ./

EXPOSE 3000
CMD ["yarn", "start"]
