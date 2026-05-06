# Sistema de diseño — Luxe Estate

## Paleta de colores

| Token        | Hex       | Uso                       |
| ------------ | --------- | ------------------------- |
| `nordic`     | `#19322F` | Headers, texto principal  |
| `mosque`     | `#006655` | Botones primarios, CTAs   |
| `hint-green` | `#D9ECC8` | Fondo tarjetas destacadas |
| `clear-day`  | `#EEF6F6` | Fondo general de la app   |

Usar siempre los nombres de token de Tailwind, nunca los valores hex directamente en JSX.

## Tipografía

- Fuente principal: **SF Pro Display** (fuente local, no Google Fonts)
- Variable CSS: `--font-sf-pro` | clase Tailwind: `font-sf`
- Respetar los tamaños del diseño de referencia exactamente

## Estilo general

- Estética: premium, minimalista, espacios generosos
- Imágenes: siempre `object-cover` con relación de aspecto fija
- Bordes: ninguno o muy sutil (`rounded-lg` como máximo)
- Sombras: solo cuando el mockup lo muestra explícitamente

## Componentes base

### Botón primario

- Fondo: `mosque` | Texto: blanco
- Sin bordes redondeados exagerados

### Tarjeta de propiedad

- Fondo: blanco o `clear-day`
- Tarjetas destacadas: fondo `hint-green`
- Layout: imagen arriba, datos abajo — no mezclar entre tarjetas del mismo grid

### Navbar

- Fondo: `nordic`
- Texto: blanco
- Logo a la izquierda, links a la derecha

## Reglas

- No instalar librerías sin consultar
- No modificar `tailwind.config.js` ni `globals.css` sin avisar
- Crear componente reutilizable cuando algo se repita 2 veces
- No hacer commit sin que se pida explícitamente
