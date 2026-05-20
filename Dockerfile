# STAGE 1: Build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

# Copia o código
COPY . .

# Usamos --mount=type=secret para injetar a chave apenas durante o build
RUN --mount=type=secret,id=serpapi_key \
    export SERPAPI_KEY=$(cat /run/secrets/serpapi_key) && \
    npm run build

RUN npm prune --production
# ... resto do Dockerfile permanece igual


# STAGE 2: Runtime (Imagem final ultra-leve baseada em Alpine)
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5173

# Copia apenas os artefatos necessários do estágio de build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/healthcheck.sh ./healthcheck.sh

# Garante permissões de execução para o script de healthcheck
USER root
RUN chmod +x ./healthcheck.sh

# Segurança: Altera para o usuário 'node' não-root pré-existente no Alpine
USER node

EXPOSE 5173

# Executa o servidor Node do SvelteKit em produção
CMD ["node", "build"]
