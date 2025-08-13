# Use build arguments for Node version
ARG NODE_VERSION=22.17.1

# ---------------- Build Stage ----------------
FROM node:${NODE_VERSION}-alpine AS builder

# Install required system libraries
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Ensure yarn is up to date
RUN corepack enable && yarn set version stable

# Copy only dependency files first for better caching
COPY package.json yarn.lock ./

RUN --mount=type=cache,id=s/d7fd1032-c073-4380-9115-7a1f24e5fdee-/root/cache/yarn,target=/root/.cache/yarn

RUN yarn install --frozen-lockfile --prefer-offline

RUN yarn cache clean

# Copy all project files (including src/app)
COPY . .

# Build the application
RUN yarn build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["yarn", "start"]


