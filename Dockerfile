# Use build arguments for Node version
ARG NODE_VERSION=22.17.1

# ---------------- Build Stage ----------------
FROM node:${NODE_VERSION}-alpine AS builder

# Install required system libraries
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy only dependency files first for better caching
COPY package.json yarn.lock ./

RUN --mount=type=cache,id=s/d7fd1032-c073-4380-9115-7a1f24e5fdee-/root/cache/pip,target=/root/.cache/pip

RUN yarn install --frozen-lockfile

# Copy all project files (including src/app)
COPY . .

# Build the application
RUN yarn build

EXPOSE 3000

CMD ["yarn", "dev"]


