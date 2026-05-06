# Hook-Pre-Commit: Base para Proyectos Next.js (Cross-Platform)

Este repositorio sirve como base sólida para iniciar proyectos de Next.js, asegurando la calidad del código, la consistencia entre sistemas operativos (Windows, Linux, macOS) y mensajes de commit estandarizados.

## 🚀 Características

- **Husky & lint-staged**: Ejecución automática de herramientas antes de cada commit.
- **Prettier**: Formateo de código automático con plugin para ordenar clases de **Tailwind CSS**.
- **ESLint**: Configuración base de Next.js para detectar errores comunes.
- **Commitlint**: Validación de mensajes de commit siguiendo el estándar de [Conventional Commits](https://www.conventionalcommits.org/).
- **Cross-Platform**: Configuración de `.editorconfig` para forzar finales de línea `LF`, evitando problemas al colaborar entre Windows y Unix.
- **Security**: Script personalizado `check-secrets.js` para prevenir el commit accidental de claves API o secretos.

## 🏁 Cómo empezar un nuevo proyecto

Para usar esta base en un nuevo proyecto, sigue estos pasos:

### 1. Preparar el repositorio

Puedes inicializar git manualmente o dejar que `npm install` / `pnpm install` lo haga automáticamente mediante el script `prepare`.

La rama inicial automática será `main` por defecto. Si prefieres `dev`, instala así:

```bash
PREPARE_GIT_BRANCH=dev pnpm install
```

Manual:

```bash
git init
```

### 2. Personalizar `package.json`

Abre `package.json` y cambia los siguientes campos:

- `name`: El nombre de tu nuevo proyecto.
- `description`: Una breve descripción de lo que hace.
- `version`: Puedes empezar en `0.1.0`.

También puedes hacerlo por terminal:

```bash
pnpm pkg set name="nombre-de-tu-proyecto"
pnpm pkg set description="Descripción de mi proyecto"
```

### 3. Instalar dependencias

```bash
pnpm install
```

### 2. Scripts Disponibles

- `pnpm run lint`: Ejecuta el linter en todo el proyecto.
- `pnpm run format`: Formatea todos los archivos con Prettier.
- `pnpm run check-secrets`: Escanea el área de staging en busca de posibles secretos (se ejecuta automáticamente en el pre-commit).

## 📝 Estándar de Commits

Los mensajes de commit deben seguir este formato:
`<tipo>(<opcional-scope>): <descripción>`

**Ejemplos:**

- `feat: add user authentication`
- `fix: resolve memory leak in dashboard`
- `chore: update dependencies`
- `docs: update readme instructions`

## ⚙️ Estructura de Configuración

- `.prettierrc` & `.prettierignore`: Reglas de estilo.
- `.eslintrc.json`: Reglas de linting.
- `commitlint.config.js`: Reglas para mensajes de commit.
- `.editorconfig`: Configuración del editor para indentación y finales de línea.
- `.husky/`: Hooks de git (pre-commit y commit-msg).
- `scripts/`: Scripts personalizados de utilidad.

---

_Hecho para acelerar el inicio de proyectos con calidad profesional e infraestructura robusta._

## 💡 Tips Adicionales (Configuraciones Avanzadas)

### 🐳 Docker

Para evitar problemas de permisos y finales de línea en contenedores:

- **`.dockerignore`**: Asegúrate de incluir `node_modules`, `.next`, `dist` y `.git`.
- **EOL**: Gracias a `.editorconfig`, los archivos se crearán con `LF`, lo que evita el error `sh: script not found` común al ejecutar hooks de Husky dentro de Docker en Windows.
- **Caché de pnpm**: Usa `pnpm fetch` en tu Dockerfile para acelerar las builds.

### 💎 Prisma

Si vas a usar Prisma como ORM:

- **Binary Engines**: En entornos Docker/Linux, asegúrate de añadir `binaryTargets = ["native", "linux-musl-openssl-3.0.x"]` en tu `schema.prisma`.
- **Hooks**: Puedes añadir `prisma generate` a tu script de `postinstall` en `package.json` para que el cliente se genere automáticamente tras un `pnpm install`.
- **Secrets**: El script `check-secrets.js` ya vigila que no subas accidentalmente tu `DATABASE_URL` del archivo `.env`.

### 🍃 Mongoose (MongoDB)

Para proyectos de Node.js con MongoDB:

- **Estructura**: Mantén tus modelos en una carpeta `models/` y asegúrate de que el linter (`.eslintrc.json`) esté configurado para permitir `strictQuery` si usas versiones recientes.
- **Tipado**: Si usas TypeScript, aprovecha las interfaces para tus esquemas para tener autocompletado total en toda la app.

## 📂 Estructura recomendada (Agnóstica)

```text
.
├── .husky/             # Hooks de git
├── .vscode/            # Configuración de editor
├── scripts/            # Scripts de utilidad (secrets, setup)
├── src/                # Código fuente (App, Components, Models, etc.)
├── templates/          # Referencias (Prisma, Hexagonal, etc.) 📦
├── .editorconfig       # Consistencia cross-platform
├── .eslintrc.json      # Linter universal
├── .prettierrc         # Formateador de código
├── tailwind.config.js  # Configuración de diseño
├── postcss.config.mjs  # Configuración de PostCSS 🎨
├── tsconfig.json       # Configuración de TypeScript 🟦
├── Dockerfile          # Configuración de imagen Docker 🐳
├── docker-compose.yml  # Orquestación de servicios (App + Postgres)
├── .env.example        # Ejemplo de variables de entorno 🔑
└── package.json        # Dependencias y scripts
```

## 📦 Referencia de Plantillas (`templates/`)

Si tu proyecto requiere configuraciones adicionales, puedes consultar el directorio `templates/` para copiar y pegar:

- **Prisma + Supabase**: Configuración de schema y cliente.
- **Arquitectura Hexagonal + Mongoose**: Estructura de carpetas y conexión base.
- **Auth (JWT + Bcrypt)**: Lógica de seguridad y tokens 🔐.
- **Auth Flow (TS)**: Base para Login y Registro (Service/Controller) 🛡️.
- **Validación (Zod)**: Esquemas y validación de datos 📐.
