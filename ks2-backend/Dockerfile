# syntax=docker/dockerfile:1

FROM node:24.14.1-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN chmod +x ./scripts/docker-entrypoint.sh

EXPOSE 3000

CMD ["./scripts/docker-entrypoint.sh"]
