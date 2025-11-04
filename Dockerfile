# ─────────────────────────────────────────────
# 1) Build stage
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Устанавливаем pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG PUBLIC_API_URL
ARG PUBLIC_ANILIBRIA_URL
ENV PUBLIC_API_URL=${PUBLIC_API_URL}
ENV PUBLIC_ANILIBRIA_URL=${PUBLIC_ANILIBRIA_URL}

RUN pnpm run build:prod

# ─────────────────────────────────────────────
# 2) Production stage — NGINX
# ─────────────────────────────────────────────
FROM nginx:1.25-alpine AS production

# Удаляем дефолтный конфиг
RUN rm -rf /usr/share/nginx/html/*

# Копируем билд rsbuild (обычно в build)
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]