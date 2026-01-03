FROM node:latest as builder
WORKDIR /bot

COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build

FROM builder
WORKDIR /bot

COPY --from=builder /bot .

CMD ["node", './dist/main.js']
