# Luxe Estate — CLAUDE.md

## Proyecto

App de venta de bienes raíces premium y minimalista. Nombre: **Luxe Estate**.
Stack: Next.js 15 (App Router), React 19, TypeScript strict, Tailwind CSS v3.
Monorepo pnpm — trabajo exclusivamente en `--filter frontend`. No tocar `backend/`.

## Estructura de carpetas (src/)

```text
src/
  app/            # Rutas — una subcarpeta por ruta, cada una con page.tsx
  components/
    ui/           # Primitivos reutilizables (Button, Badge, Card, Icon...)
    sections/     # Secciones de página (Hero, FeaturedListings, Navbar...)
  lib/            # Utilidades y helpers puros
  types/          # Tipos TypeScript compartidos entre 2+ archivos
```

## Convenciones

- Componentes: PascalCase en nombre de archivo y export — `PropertyCard.tsx`
- Alias de importación: `@/` apunta a `src/`
- No crear barrel exports (`index.ts`) salvo que el módulo tenga 3+ exports
- Tipos inline si solo los usa un archivo; en `types/` si son compartidos

## Paleta — tokens definidos en tailwind.config.js

| Nombre Tailwind | Hex       | Uso                       |
| --------------- | --------- | ------------------------- |
| `nordic`        | `#19322F` | Headers, texto principal  |
| `mosque`        | `#006655` | Botones primarios, CTAs   |
| `hint-green`    | `#D9ECC8` | Fondo tarjetas destacadas |
| `clear-day`     | `#EEF6F6` | Fondo general de la app   |

## Tipografía

- Fuente: SF Pro Display — cargada como fuente local (no Google Fonts)
- Variable CSS: `--font-sf-pro` | Clase Tailwind: `font-sf`

## Diseño de referencia

- Los mockups están en `/antigravity/` — revisar antes de implementar cualquier sección
- Seguir los diseños con fidelidad; no inventar layouts ni variantes no mostradas

## Reglas

- No instalar librerías sin consultar primero
- No modificar `tailwind.config.js` ni `globals.css` sin avisar
- Crear componente reutilizable en cuanto algo se repita 2 veces
- No hacer commit sin que se pida explícitamente
