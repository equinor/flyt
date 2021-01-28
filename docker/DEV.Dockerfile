# This builds the DEV-environment image

FROM node:15.5.1-alpine3.10 AS builder
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install --production --pure-lockfile --non-interactive
COPY public public
COPY src src
COPY tsconfig.json tsconfig.json
COPY docker/DEV.env .env
RUN yarn build

FROM nginx
COPY --from=builder /build /usr/share/nginx/html
