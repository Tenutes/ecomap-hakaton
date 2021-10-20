FROM alpine:latest

RUN apk add --no-cache --update bash nodejs npm
ADD ./ /app

WORKDIR /app
RUN npm install && npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
