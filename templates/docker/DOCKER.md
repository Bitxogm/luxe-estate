# Base para Docker Local

## 🐳 Dockerfile (Node.js)
```dockerfile
FROM node:20-alpine AS base

# Instalación de pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Dependencias
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Desarrollo
FROM base AS dev
COPY . .
CMD ["pnpm", "dev"]
```

## 🏗️ docker-compose.yml
```yaml
name: my-app-template

services:
  app:
    build:
      context: .
      target: dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/my_db?schema=public
    depends_on:
      - postgres

  postgres:
    image: postgres:16
    container_name: ${PROJECT_NAME:-app}-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: my_db
    ports:
      - "54320:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```
