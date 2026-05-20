# STAGE 1: Build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

# Copia o código
COPY . .

# Usamos --mount para injetar o segredo durante o build
# O build do SvelteKit gera a pasta /app/build
RUN --mount=type=secret,id=serpapi_key \
    export SERPAPI_KEY=$(cat /run/secrets/serpapi_key) && \
    npm run build

# Remove dependências de desenvolvimento APÓS o build
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