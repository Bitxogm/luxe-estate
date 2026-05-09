/**
 * Prisma Client Singleton
 *
 * En Prisma v7, el cliente se genera en src/generated/prisma.
 * Para evitar crear múltiples instancias en desarrollo (hot-reload de Next.js),
 * usamos el patrón singleton via globalThis.
 */
import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
