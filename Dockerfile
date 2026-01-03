FROM node:latest AS builder
WORKDIR /bot

COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build

FROM builder
WORKDIR /bot

COPY --from=builder /bot .
RUN --mount=type=secret,id=BOT_TOKEN \
    BOT_TOKEN=$(cat /run/secrets/BOT_TOKEN)

CMD ["node", "./dist/main.js"]
