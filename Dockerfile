# build stage
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# static nginx stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# optional: custom nginx.conf can be copied if нужно
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
