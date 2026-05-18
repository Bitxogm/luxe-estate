# 🏡 Luxe Estate

> Premium real estate marketplace built with Next.js 15, TypeScript and PostgreSQL.

**Live demo:** [https://luxe-estate-frontend-tau.vercel.app](https://luxe-estate-frontend-tau.vercel.app)  
**Author:** Víctor Manuel González Moreno  
**GitHub:** [https://github.com/Bitxogm](https://github.com/Bitxogm)  
**LinkedIn:** [https://www.linkedin.com/in/victor-manuel-gonzalez-moreno/](https://www.linkedin.com/in/victor-manuel-gonzalez-moreno/)  
**Portfolio:** [https://www.bitxodev.com/](https://www.bitxodev.com/)

---

## ✨ Features

- 🏠 **Property listings** with advanced search, dynamic multi-option filters, and pagination.
- 🗺️ **Interactive map** integrated via Maptiler + Leaflet for location tracking.
- 🖼️ **Multi-image gallery** with drag-and-drop uploads powered by Cloudinary storage.
- 💬 **Real-time messaging** between buyers and owners powered by Pusher.
- 💳 **Stripe payment system** managing featured listings, subscriptions, and visit deposits.
- ⭐ **Reviews & ratings** system with owner restrictions and dynamic client rendering.
- 🔔 **Real-time notifications** for incoming messages, visits, and reviews.
- ⚖️ **Property comparator** supporting dynamic side-by-side spec sheets and high-fidelity highlighting.
- 🔐 **Authentication** with NextAuth v5 (credentials, custom callbacks & JWT).
- 👤 **User roles** support: buyer, owner, and administrator capabilities.
- 📱 **Fully responsive** interface styled with custom HSL tokens, micro-animations, and mobile drawers.
- 🌙 **Dark mode** support dynamically synchronized.
- 🔍 **SEO optimized** with customized meta tags, dynamic slug headers, and weekly sitemaps.

---

## 🛠️ Tech Stack

| Layer               | Technology                   |
| ------------------- | ---------------------------- |
| **Framework**       | Next.js 15 (App Router)      |
| **Language**        | TypeScript strict            |
| **Styling**         | Tailwind CSS v3              |
| **Database**        | PostgreSQL (Neon serverless) |
| **ORM**             | Prisma 5                     |
| **Auth**            | NextAuth v5                  |
| **Payments**        | Stripe                       |
| **Real-time**       | Pusher                       |
| **Storage**         | Cloudinary                   |
| **Maps**            | Maptiler + Leaflet           |
| **Deployment**      | Vercel                       |
| **Package manager** | pnpm                         |

---

## 🏗️ Architecture

A clean, tiered layered architecture:

```
Server Components ➔ Server Actions ➔ Services ➔ Repositories ➔ Prisma ORM ➔ Neon Database
```

- **Repository pattern**: Database transactions are exclusively encapsulated under `src/server/repositories/`.
- **Server Actions**: Orchestrates all mutations, utilizing Zod schemas and calling `revalidatePath()` on writes.
- **server-only**: Restricts database connections and secrets from leaking into the client bundles.
- **Zod validation**: Implements strict twin-barrier data validations at both the HTTP layer and the core domain layer.

### Folder Structure Overview

```
src/
  app/          # Routes — App Router
  components/   # UI primitives and page sections
  server/
    actions/    # Server Actions ("use server")
    repositories/ # Direct DB access via Prisma
    services/   # Business logic
    validations/ # Zod schemas
  lib/          # Utilities and external clients
  types/        # Shared TypeScript types
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL database (Neon recommended)
- API Credentials: Cloudinary, Pusher, Stripe, and Maptiler

### 1. Clone the repository

```bash
git clone https://github.com/Bitxogm/luxe-estate.git
cd luxe-estate
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Crea el archivo `.env.local` en la raíz del proyecto:

```env
# Database (Neon PostgreSQL)
DATABASE_URL=your_neon_connection_string

# Auth (NextAuth)
AUTH_SECRET=your_auth_secret  # generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Pusher
PUSHER_APP_ID=your_app_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=your_cluster
NEXT_PUBLIC_PUSHER_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Maptiler
NEXT_PUBLIC_MAPTILER_KEY=your_maptiler_key
```

### 4. Set up the database

```bash
# Push schema to database
npx prisma db push

# Seed with demo data and users
nvm exec 22 npx tsx prisma/seed.ts
```

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Demo accounts (after seeding)

| Role      | Email          | Password     |
| --------- | -------------- | ------------ |
| **User**  | demo@luxe.com  | `Demo1234!`  |
| **Admin** | admin@luxe.com | `Admin1234!` |

---

## 💳 Stripe Test Cards

| Card         | Number                |
| ------------ | --------------------- |
| **Success**  | `4242 4242 4242 4242` |
| **Declined** | `4000 0000 0000 0002` |

Use any future expiry date and any 3-digit CVC.

---

## 📁 Key Files

| File                    | Purpose                  |
| ----------------------- | ------------------------ |
| `src/auth.ts`           | NextAuth configuration   |
| `src/lib/prisma.ts`     | Prisma singleton client  |
| `src/lib/cloudinary.ts` | Cloudinary upload client |
| `src/lib/pusher.ts`     | Pusher server client     |
| `src/lib/stripe.ts`     | Stripe server client     |
| `prisma/schema.prisma`  | Database schema          |
| `prisma/seed.ts`        | Demo data seed script    |

---

## 📄 License

MIT — feel free to use this project as inspiration for your own.
