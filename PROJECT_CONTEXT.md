# Luxe Estate — Project Context

## What it is

Premium real estate app for buying, renting, and listing properties. Deployed on Vercel.
Repo: https://github.com/Bitxogm/luxe-estate
Branches: `main` (production/Vercel) and `dev` (development). Workflow: work on dev → merge to main → push both.

## Stack

| Layer         | Tech                                                                                |
| ------------- | ----------------------------------------------------------------------------------- |
| Framework     | Next.js 15 (App Router, Server Components by default)                               |
| UI            | React 19, TailwindCSS v3, lucide-react (icons), sonner (toasts)                     |
| Auth          | NextAuth v5 (beta.31) — credentials provider + JWT strategy, `@auth/prisma-adapter` |
| ORM           | Prisma v7 with PostgreSQL (driver `pg` + `@prisma/adapter-pg`)                      |
| Validation    | Zod                                                                                 |
| Forms         | react-hook-form + @hookform/resolvers                                               |
| UI Primitives | shadcn/ui (Radix UI under the hood, `cn()` utility available)                       |
| Language      | TypeScript strict                                                                   |
| Linting       | ESLint, Prettier + prettier-plugin-tailwindcss                                      |
| Git hooks     | Husky + lint-staged + commitlint (conventional commits required)                    |

## Design System

### Color tokens (Tailwind)

| Token          | Hex       | Use                       |
| -------------- | --------- | ------------------------- |
| `nordic`       | `#19322F` | Headers, primary text     |
| `mosque`       | `#006655` | Primary buttons, CTAs     |
| `hint-green`   | `#D9ECC8` | Featured card backgrounds |
| `clear-day`    | `#EEF6F6` | General app background    |
| `nordic-muted` | `#5C706D` | Secondary text            |

Typography: SF Pro Display — Tailwind class `font-sf`.

Style: premium, minimalist, generous spacing. Never use hex values directly in JSX — always use token names.

## Folder Structure (src/)

```
src/
  app/                          # App Router routes
    page.tsx                    # Home — hero + featured + listings grid
    favorites/page.tsx          # Saved properties
    profile/page.tsx            # Profile: saved, visits, settings tabs
    dashboard/page.tsx          # Owner panel: my properties + stats
    admin/users/page.tsx        # Admin panel: user directory + role management
    login/                      # LoginForm.tsx (credentials)
    register/                   # RegisterForm.tsx
    properties/
      new/page.tsx              # Create property
      [slug]/page.tsx           # Property detail
      [slug]/edit/page.tsx      # Edit property (owner or admin only)
      [slug]/schedule/page.tsx  # Schedule a visit
  components/
    ui/                         # Primitives: PropertyCard, FeaturedPropertyCard, SaveButton, button, input...
    sections/                   # Navbar, NavbarUserMenu, HeroSearch, FeaturedListings, SearchFiltersModal
    properties/                 # NewPropertyForm, PropertyDetail, PropertyActions, ScheduleVisitForm
    profile/                    # ProfileHeader, ProfileTabs, PreferencesForm
    dashboard/                  # DeletePropertyButton
    admin/                      # ChangeRoleButton, UserSearchInput
  server/
    actions/                    # Server Actions ("use server")
      auth.action.ts            # registerUser
      property.action.ts        # createPropertyAction, updatePropertyAction, deletePropertyAction
      saved.action.ts           # toggleSaveAction
      user.action.ts            # changeUserRoleAction
      visit.action.ts           # scheduleVisitAction
    repositories/               # Direct DB access via Prisma
      property.repository.ts
      user.repository.ts
      visit.repository.ts
    services/
      property.service.ts       # getPropertyBySlug (with Zod validation)
    validations/
      property.schema.ts        # Shared Zod schema for create/update
  lib/
    toast.ts                    # notify.success / notify.error (sonner)
    mockData.ts                 # Seed data
  auth.ts                       # NextAuth configuration
  types/
    property.ts                 # PropertyStatus type
```

## Prisma Models

```prisma
model User {
  id           String    @id @default(cuid())
  name         String?
  email        String    @unique
  passwordHash String?
  role         String    @default("user")   // "user" | "admin"
  image        String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  properties   Property[]
  savedProperties SavedProperty[]
  visits       Visit[]
}

model Property {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  address     String
  city        String
  price       Float
  priceType   String                        // "sale" | "rent"
  beds        Int
  baths       Float
  sqm         Float
  type        String
  status      String                        // "FOR SALE" | "FOR RENT"
  badge       String?                       // "Exclusive" | "New Arrival" | "Price Drop"
  imageUrl    String
  imageAlt    String
  isFeatured  Boolean  @default(false)
  userId      String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model SavedProperty {
  userId     String
  propertyId String
  @@unique([userId, propertyId])
}

model Visit {
  id          String   @id @default(cuid())
  userId      String
  propertyId  String
  scheduledAt DateTime
  message     String?
  status      String   @default("pending") // "pending" | "confirmed" | "cancelled"
  createdAt   DateTime @default(now())
}
```

## Authentication

Session JWT shape: `session.user.{ id, email, name, role }`

Auth guard pattern (server component):

```ts
const session = await auth();
if (!session?.user?.id) redirect("/login?callbackUrl=/target");
if (session.user.role !== "admin") redirect("/");
```

## Patterns & Conventions

- **Repository pattern**: DB is only accessed from `src/server/repositories/`
- **Server Actions** for mutations; always call `revalidatePath()` after writes
- **`useSearchParams()`** requires a `<Suspense>` wrapper in App Router
- Client components only when needed (`"use client"` + hooks/events)
- Import alias `@/` points to `src/`
- No barrel exports unless a module has 3+ exports
- Types inline if used in one file; in `types/` if shared across 2+
- No comments unless the WHY is non-obvious
- **Do not install libraries without asking first**
- **Do not modify `tailwind.config.js` or `globals.css` without warning**
- **Do not commit without being explicitly asked**
- Commits: conventional commits enforced by commitlint (`feat/fix/chore/refactor/docs/style/test/perf`)

## Implemented Features

1. **Home** — hero search, type/priceType/city filters, featured properties grid, paginated listings grid
2. **Property detail** — image, specs, save button, edit link (owner/admin), Schedule Tour CTA
3. **Create / Edit property** — single `NewPropertyForm` component, dual mode via optional `property` prop
4. **Schedule visit** — `/properties/[slug]/schedule` with date/time/message form
5. **Favorites** — optimistic save toggle, `/favorites` page with saved listings
6. **Profile** — 3 tabs: Saved Properties, Scheduled Visits (with status badges), Preferences & Settings
7. **Dashboard** — `/dashboard`: stats cards (total/sale/rent), paginated property table, inline edit + delete (2-click confirm)
8. **Admin panel** — `/admin/users`: user list with live search, role tab filters, role change dropdown
9. **Auth pages** — Login and Register redesigned with app tokens (no shadcn Card), Building2 logo, mosque CTA button
10. **Navbar** — functional links, user avatar menu with role-based items (Admin Panel visible to admins only)

## Key Component Details

**PropertyCard** (`src/components/ui/PropertyCard.tsx`)

- Article wraps a Link (image + info) + separate "Schedule Tour" Link below
- The two are siblings, not nested, to avoid invalid HTML

**NewPropertyForm** (`src/components/properties/NewPropertyForm.tsx`)

- Accepts optional `property?: Property` prop
- Uses `createPropertyAction` when creating, `updatePropertyAction` when editing
- Hidden `propertyId` input injected in edit mode

**NavbarUserMenu** (`src/components/sections/NavbarUserMenu.tsx`)

- CSS-only dropdown (`group-focus-within`)
- Shows Admin Panel link only when `role === "admin"`

**DeletePropertyButton** (`src/components/dashboard/DeletePropertyButton.tsx`)

- Two-click confirmation pattern (no modal): first click → "Confirm", second click → calls `deletePropertyAction`

**ChangeRoleButton** (`src/components/admin/ChangeRoleButton.tsx`)

- Click-outside handler via `useRef` + `useEffect`
- Calls `changeUserRoleAction`, cannot change own role
