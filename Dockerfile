FROM alpine:latest as build-stage

RUN apk add --no-cache --update bash nodejs npm
ADD ./ /app

WORKDIR /app
RUN npm install && npm rebuild node-sass && npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
