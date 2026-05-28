# STAGE 1: Build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

# Copia o código
COPY . .

# Recebe a chave do Docker Compose e injeta no ambiente de build
ARG SERPAPI_KEY
ENV SERPAPI_KEY=$SERPAPI_KEY

RUN npm run build
RUN npm prune --production

# STAGE 2: Runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5173

# Copia apenas o necessário do estágio de builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/healthcheck.sh ./healthcheck.sh

USER root
RUN chmod +x ./healthcheck.sh

USER node

EXPOSE 5173

CMD ["node", "build"]