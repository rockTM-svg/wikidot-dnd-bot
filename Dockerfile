FROM node:25-alpine AS builder
WORKDIR /bot

COPY package*.json ./

RUN npm install --include=dev
COPY . .
RUN npm run build

# take only .js files for running 
FROM node:25-alpine AS bot
WORKDIR /bot

COPY --from=builder /bot/package*.json ./
COPY --from=builder /bot/dist/ ./dist
COPY --from=builder /bot/.env ./
RUN npm install --omit=dev

RUN apk add curl
RUN curl -sfS https://dotenvx.sh/install.sh | sh

CMD ["dotenvx", "run", "--","node", "./dist/main.js"]