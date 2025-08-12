# Use build arguments for Node version
ARG NODE_VERSION=22.17.1

# Use Alpine-based Node image
FROM node:${NODE_VERSION}-alpine AS builder

# Install required system libraries
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy only dependency files first for better caching
COPY package.json yarn.lock ./

RUN --mount=type=cache,id=s/d7fd1032-c073-4380-9115-7a1f24e5fdee-/root/cache/pip,target=/root/.cache/pip

# Install dependencies using cache mount for speed
RUN --mount=type=cache,target=/root/.cache/yarn \
    yarn install --frozen-lockfile

# Copy all project files
COPY . .

# Build the application
RUN yarn build

# ---------------- Production Stage ----------------
FROM node:${NODE_VERSION}-alpine AS production

WORKDIR /app

# Copy only necessary files from build stage
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
EXPOSE 3000

CMD ["yarn", "start"]

