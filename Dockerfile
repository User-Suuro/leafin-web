ARG NODE_VERSION=20.11.1
ARG RAILWAY_SERVICE_ID=d7fd1032-c073-4380-9115-7a1f24e5fdee

FROM node:${NODE_VERSION}-alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json yarn.lock ./

RUN --mount=type=cache,id=${RAILWAY_SERVICE_ID}-yarn-cache,target=/root/.cache/yarn \
    yarn install --frozen-lockfile --production

COPY . .

RUN yarn build

EXPOSE 3000

ENV NODE_ENV=production

CMD ["yarn", "start"]
