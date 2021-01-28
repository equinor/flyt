## => Build container
#FROM node:15.5.1-alpine3.10 as builder
#WORKDIR /app
#COPY package.json .
#COPY yarn.lock .
#RUN yarn install --production --pure-lockfile --non-interactive
#COPY public public
#COPY src src
#COPY tsconfig.json tsconfig.json
#COPY .env .env
#RUN yarn build
#
## => Run container
#FROM nginx:1.19-alpine
#
## Nginx config
#RUN rm -rf /etc/nginx/conf.d
#COPY conf /etc/nginx
#
## Static build
#COPY --from=builder /app/build /usr/share/nginx/html/
#
## Default port exposure
#EXPOSE 80
#
## Copy .env file and shell script to container
#WORKDIR /usr/share/nginx/html
#COPY ./env.sh .
#COPY .env .
#
## Add bash
#RUN apk add --no-cache bash
#
## Make our shell script executable
#RUN chmod +x env.sh
#
## Make environment variables available & Start Nginx server
#CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && cp /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.copy && envsubst < /etc/nginx/conf.d/default.conf.copy > /etc/nginx/conf.d/default.conf && nginx -g \"daemon off;\""]

# => Build container
FROM node:alpine as builder
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY public public
COPY src src
COPY tsconfig.json tsconfig.json
COPY .env .env
RUN yarn build

# => Run container
FROM nginx:1.15.2-alpine

# Nginx config
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx

# Static build
COPY --from=builder /app/build /usr/share/nginx/html/

# Default port exposure
EXPOSE 80

# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY .env .

# Add bash
RUN apk add --no-cache bash

# Make our shell script executable
RUN chmod +x env.sh

# Inject environment variables & Start Nginx server
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
