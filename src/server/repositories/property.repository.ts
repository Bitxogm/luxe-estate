import "server-only";
import { prisma } from "@/lib/prisma";
import type { PropertyFilters } from "@/server/validations/property.schema";

function buildWhere(filters: Omit<PropertyFilters, "page" | "limit">) {
  const priceFilter =
    filters.minPrice !== undefined || filters.maxPrice !== undefined
      ? {
          price: {
            ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
            ...(filters.maxPrice !== undefined && { lte: filters.maxPrice }),
          },
        }
      : {};

  return {
    ...(filters.priceType && { priceType: filters.priceType }),
    ...(filters.type && { type: filters.type }),
    ...(filters.city && { city: { contains: filters.city, mode: "insensitive" as const } }),
    ...(filters.featured !== undefined && { isFeatured: filters.featured }),
    ...priceFilter,
    ...(filters.minBeds !== undefined && { beds: { gte: filters.minBeds } }),
    ...(filters.minBaths !== undefined && { baths: { gte: filters.minBaths } }),
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

export async function findPropertyBySlug(slug: string) {
  return prisma.property.findUnique({ where: { slug } });
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

export async function findPropertiesByUser(userId: string, page = 1, limit = 8) {
  const skip = (page - 1) * limit;
  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.property.count({ where: { userId } }),
  ]);
  return { properties, total };
}

export async function getUserPropertyStats(userId: string) {
  const [total, forSale, forRent] = await Promise.all([
    prisma.property.count({ where: { userId } }),
    prisma.property.count({ where: { userId, priceType: "sale" } }),
    prisma.property.count({ where: { userId, priceType: "rent" } }),
  ]);
  return { total, forSale, forRent };
}

export async function getSavedPropertyIds(userId: string): Promise<Set<string>> {
  const saved = await prisma.savedProperty.findMany({
    where: { userId },
    select: { propertyId: true },
  });
  return new Set(saved.map((s) => s.propertyId));
}

export async function toggleSavedProperty(
  userId: string,
  propertyId: string
): Promise<{ saved: boolean }> {
  const existing = await prisma.savedProperty.findUnique({
    where: { userId_propertyId: { userId, propertyId } },
  });

  if (existing) {
    await prisma.savedProperty.delete({
      where: { userId_propertyId: { userId, propertyId } },
    });
    return { saved: false };
  }

  await prisma.savedProperty.create({ data: { userId, propertyId } });
  return { saved: true };
}

export async function findSavedProperties(userId: string) {
  const saved = await prisma.savedProperty.findMany({
    where: { userId },
    include: { property: true },
    orderBy: { createdAt: "desc" },
  });
  return saved.map((s) => s.property);
}
