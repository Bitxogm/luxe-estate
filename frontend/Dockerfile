FROM node:20-alpine AS base

# Instalación de pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Dependencias
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

# Desarrollo
FROM base AS dev
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]
