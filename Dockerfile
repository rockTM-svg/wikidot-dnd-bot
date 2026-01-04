FROM node:latest AS builder
WORKDIR /bot

COPY package*.json ./

RUN npm install --omit=prod
COPY . .
RUN npm run build

FROM builder AS runner
WORKDIR /bot

COPY --from=builder /bot/dist ./dist
COPY --from=builder /bot/package.json ./package.json 

RUN npm install --omit=dev
RUN --mount=type=secret,id=BOT_TOKEN \
    BOT_TOKEN=$(cat /run/secrets/BOT_TOKEN)

CMD ["node", "./dist/main.js"]