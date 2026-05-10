import "server-only";
import { prisma } from "@/lib/prisma";
import type { PropertyFilters } from "@/server/validations/property.schema";

function buildWhere(filters: Omit<PropertyFilters, "page" | "limit">) {
  return {
    ...(filters.priceType && { priceType: filters.priceType }),
    ...(filters.type && { type: filters.type }),
    ...(filters.city && { city: { contains: filters.city, mode: "insensitive" as const } }),
    ...(filters.featured !== undefined && { isFeatured: filters.featured }),
  };
}

export async function findManyProperties(filters: PropertyFilters) {
  const { page, limit, ...rest } = filters;
  const where = buildWhere(rest);

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.property.count({ where }),
  ]);

  return { properties, total };
}

export async function findFeaturedProperties(limit = 2) {
  return prisma.property.findMany({
    where: { isFeatured: true },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function findPropertyById(id: string) {
  return prisma.property.findUnique({ where: { id } });
}

export async function createProperty(data: Parameters<typeof prisma.property.create>[0]["data"]) {
  return prisma.property.create({ data });
}

export async function updateProperty(
  id: string,
  data: Parameters<typeof prisma.property.update>[0]["data"]
) {
  return prisma.property.update({ where: { id }, data });
}

export async function deleteProperty(id: string) {
  return prisma.property.delete({ where: { id } });
}
