# Instrucciones del proyecto — Luxe Estate

## Contexto

App de venta de bienes raíces premium. Nombre: **Luxe Estate**.
Stack: Next.js 15 (App Router), React 19, TypeScript strict, Tailwind CSS v3.
El proyecto ya tiene la estructura base y Tailwind configurado con la paleta del proyecto.

## Estructura de carpetas (src/)

```text
src/
  app/            # Rutas — una subcarpeta por ruta, cada una con page.tsx
  components/
    ui/           # Primitivos reutilizables basados en shadcn/ui
    sections/     # Secciones de página (Hero, FeaturedListings, Navbar...)
  lib/            # Utilidades y helpers puros (ej. utilidad cn() para shadcn)
  types/          # Tipos TypeScript compartidos entre 2+ archivos
```

## Convenciones de Desarrollo

- **Componentes:** Usar PascalCase (ej. `PropertyCard.tsx`). Todos los componentes son Server Components por defecto; usar `'use client'` solo cuando haya interactividad (hooks, eventos).
- **Rutas y Alias:** Usar siempre el alias `@/` que apunta a `src/`.
- **Exportaciones:** No crear barrel exports (`index.ts`) salvo que haya 3+ exports del mismo módulo.
- **Estilos y Componentes UI:** Usar TailwindCSS. Utilizaremos **shadcn/ui** para los componentes base y la función utilitaria `cn` (clsx + tailwind-merge) para el manejo de clases.
- **Iconos:** Utilizaremos **`lucide-react`** para toda la iconografía.
- **Data Fetching:** Priorizar Server Components para obtener datos.

## Páginas a implementar

1. **Home** — Hero, propiedades destacadas, CTA
2. **Listado** — Grid de propiedades con filtros básicos
3. **Detalle de propiedad** — Galería, descripción, mapa, CTA de contacto
4. **Página de contacto** — Formulario básico

## Sistema de diseño

Ver `antigravity/guidelines.md` para paleta, tipografía y patrones de componentes.
Los mockups visuales están en esta misma carpeta `antigravity/`.

## Para usar con el Asistente IA

Adjunta este archivo y `guidelines.md` como contexto prioritario al inicio de cada sesión.
Las decisiones de arquitectura que no estén definidas aquí, deben consultarse antes de ser implementadas de forma compleja.
No es necesario un archivo `gemini.md` separado — estos dos archivos son suficientes.
