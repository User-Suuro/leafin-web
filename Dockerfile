ARG NODE_VERSION=20.11.1

FROM node:${NODE_VERSION}-alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json yarn.lock ./

RUN --mount=type=cache,id=s/$d7fd1032-c073-4380-9115-7a1f24e5fdee-/pnpm/store,target=/pnpm/store pnpm install --prod --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3000

ENV NODE_ENV=production

CMD ["yarn", "start"]
