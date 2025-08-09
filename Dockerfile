# Use Node 22 (same as your local machine)
FROM node:22-alpine AS deps

WORKDIR /app

# Install Corepack to manage Yarn version
RUN npm install -g corepack@0.24.1 && corepack enable

# Copy only dependency files first (for better build caching)
COPY package.json yarn.lock ./

# Install dependencies using cache mount
RUN --mount=type=cache,id=yarn-cache,target=/usr/local/share/.cache/yarn \
    yarn install --frozen-lockfile

# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Copy installed dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the source code
COPY . .

# Build your app
RUN yarn build

# Production image
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built app and production dependencies
COPY --from=builder /app ./

EXPOSE 3000
CMD ["yarn", "start"]
