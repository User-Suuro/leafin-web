ARG NODE_VERSION=22.17.1

FROM node:${NODE_VERSION}-alpine AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

RUN corepack enable && yarn set version stable

COPY package.json yarn.lock ./

RUN --mount=type=cache,id=s/d7fd1032-c073-4380-9115-7a1f24e5fdee-/root/cache/yarn,target=/root/.cache/yarn

RUN yarn install --frozen-lockfile --prefer-offline

RUN yarn cache clean

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]


