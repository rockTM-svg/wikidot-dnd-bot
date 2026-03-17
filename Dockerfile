FROM node:25-alpine AS builder
WORKDIR /bot

COPY package*.json ./
RUN npm install --omit=dev

RUN apk add curl
RUN curl -sfS https://dotenvx.sh/install.sh | sh

CMD ["dotenvx", "run", "--","node", "./main.js"]