# Use build arguments for Node version
ARG NODE_VERSION=22.17.1

FROM node:${NODE_VERSION}-alpine AS base

# Install required system libraries
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

ARG CACHE_KEY=s/d7fd1032-c073-4380-9115-7a1f24e5fdee

# Enable corepack and set up yarn
RUN --mount=type=cache,id=${CACHE_KEY}-/usr/local/share/cache/yarn/v6,target=/usr/local/share/.cache/yarn/v6 \
    npm install -g corepack@0.24.1 && corepack enable

# Copy package files first for better caching
COPY package.json yarn.lock* ./

# Install dependencies
RUN --mount=type=cache,id=${CACHE_KEY}-/usr/local/share/cache/yarn/v6,target=/usr/local/share/.cache/yarn/v6 \
    yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]