# Luxe Estate

Marketplace de bienes raíces premium. Permite explorar, filtrar y paginar propiedades en venta y alquiler con una interfaz minimalista y de alto rendimiento.

## Stack

| Capa               | Tecnología                   |
| ------------------ | ---------------------------- |
| Framework          | Next.js 15 (App Router)      |
| Lenguaje           | TypeScript strict            |
| Estilos            | Tailwind CSS v3              |
| ORM                | Prisma 7                     |
| Base de datos      | PostgreSQL (Neon serverless) |
| Validación         | Zod                          |
| Despliegue         | Vercel                       |
| Gestor de paquetes | pnpm (monorepo)              |

## Arquitectura

### Estructura de carpetas

```
frontend/src/
  app/
    api/
      properties/
        route.ts          # GET /api/properties, POST /api/properties
        [id]/
          route.ts        # GET, PATCH, DELETE /api/properties/:id
    page.tsx              # Homepage (Server Component)
    layout.tsx

  components/
    ui/                   # Primitivos reutilizables (PropertyCard, FeaturedPropertyCard...)
    sections/             # Secciones de página (Navbar, Hero, FeaturedCollections...)

  server/                 # Código exclusivo del servidor (server-only)
    repositories/
      property.repository.ts   # Queries Prisma sin lógica de negocio
    services/
      property.service.ts      # Lógica de negocio, valida inputs, llama al repo
    validations/
      property.schema.ts       # Schemas Zod compartidos

  lib/
    prisma.ts             # Singleton del cliente Prisma

  types/
    property.ts           # Tipos de dominio
    api.ts                # Tipos de respuesta HTTP
```

### Flujo de datos

```
Server Component  →  service  →  repository  →  Prisma  →  Neon
Client Component  →  fetch  →  API route  →  service  →  repository  →  Prisma  →  Neon
```

Los Server Components llaman al servicio directamente — sin HTTP, sin overhead. Las API routes existen para consumo desde el cliente o desde herramientas externas.

### Decisiones de diseño

**Por qué repository + service y no acceso directo a Prisma desde las routes**
Las routes son controladores HTTP. Si se cambia el ORM o la fuente de datos, solo cambia el repositorio. La lógica de negocio en el servicio es testeable sin HTTP.

**Por qué `server-only` en `server/`**
Evita importaciones accidentales de código servidor en Client Components, lo que filtraría credenciales de BD al bundle del navegador.

**Por qué paginación server-side vía URL**
Los `searchParams` de la URL son la fuente de verdad del estado de paginación y filtros. Permite compartir URL con estado, navegar hacia atrás con el historial del navegador y renderizar en servidor sin JavaScript.

**Por qué Prisma 7 con `@prisma/adapter-pg` y no el motor por defecto**
Prisma 7 eliminó el motor nativo (`library`) y exige un driver adapter para conexiones directas a PostgreSQL. `@prisma/adapter-pg` usa `pg.Pool`, compatible con Neon y entornos serverless.

**Por qué Neon y no Vercel Postgres**
Vercel Postgres fue reemplazado por Prisma Postgres (requiere Prisma Accelerate y tarjeta de crédito). Neon ofrece PostgreSQL serverless en free tier sin tarjeta, con URL estándar compatible con `@prisma/adapter-pg`.

**Por qué Zod en el servicio y en las routes**
Las routes validan la entrada HTTP (strings de query params, body JSON). El servicio re-valida antes de llegar al repositorio. Doble barrera: una para el protocolo HTTP, otra para la lógica de dominio.

## Configuración local

### Requisitos

- Node.js 20+
- pnpm 9+

### Instalación

```bash
pnpm install
```

### Variables de entorno

Crea `frontend/.env.local`:

```env
DATABASE_URL=<tu-connection-string-de-neon>
```

### Base de datos

Aplicar el schema:

```bash
pnpm --filter frontend exec prisma db push
```

Seed inicial (requiere Node 20+):

```bash
DATABASE_URL="..." nvm exec 20 npx tsx frontend/prisma/seed.ts
```

### Desarrollo

```bash
pnpm dev
```

## Despliegue

El proyecto despliega automáticamente en Vercel desde la rama `main`.

Variable de entorno requerida en Vercel:

| Key            | Descripción                                                     |
| -------------- | --------------------------------------------------------------- |
| `DATABASE_URL` | Connection string de Neon (usar URL del pooler para serverless) |

## Scripts

| Comando                                      | Descripción                                 |
| -------------------------------------------- | ------------------------------------------- |
| `pnpm dev`                                   | Servidor de desarrollo (frontend + backend) |
| `pnpm --filter frontend run build`           | Build de producción                         |
| `pnpm --filter frontend exec prisma db push` | Sincronizar schema con la BD                |
| `pnpm --filter frontend exec prisma studio`  | UI visual de la BD                          |

## Convenciones de commits

Formato: `<tipo>(<scope>): <descripción>`

```
feat: add property detail page
fix: correct pagination offset
refactor: extract property service layer
docs: update architecture decisions
```

## Seguridad

- Validación de todos los inputs con Zod en API routes y servicios
- `server-only` para proteger credenciales de BD en el bundle del cliente
- Script `check-secrets.js` en pre-commit para prevenir filtrado de credenciales
- Variables de entorno nunca commiteadas (`.env.local` en `.gitignore`)
