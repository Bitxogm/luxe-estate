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
    ui/           # Primitivos reutilizables (Button, Badge, Card...)
    sections/     # Secciones de página (Hero, FeaturedListings, Navbar...)
  lib/            # Utilidades y helpers puros
  types/          # Tipos TypeScript compartidos entre 2+ archivos
```

## Convenciones

- Componentes en PascalCase: `PropertyCard.tsx`
- Alias `@/` apunta a `src/`
- No crear barrel exports salvo que haya 3+ exports del mismo módulo

## Páginas a implementar

1. **Home** — Hero, propiedades destacadas, CTA
2. **Listado** — Grid de propiedades con filtros básicos
3. **Detalle de propiedad** — Galería, descripción, mapa, CTA de contacto
4. **Página de contacto** — Formulario básico

## Sistema de diseño

Ver `antigravity/guidelines.md` para paleta, tipografía y patrones de componentes.
Los mockups visuales están en esta misma carpeta `antigravity/`.

## Para usar con Gemini

Adjunta este archivo y `guidelines.md` al inicio de cada sesión.
No es necesario un archivo `gemini.md` separado — estos dos archivos son suficientes.
