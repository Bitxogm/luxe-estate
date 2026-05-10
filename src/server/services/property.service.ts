import "server-only";
import * as repo from "@/server/repositories/property.repository";
import {
  propertyIdSchema,
  propertyFiltersSchema,
  createPropertySchema,
  updatePropertySchema,
  type PropertyFilters,
  type CreatePropertyInput,
  type UpdatePropertyInput,
} from "@/server/validations/property.schema";
import type { PaginatedResponse } from "@/types/api";
import type { Property } from "@prisma/client";

export async function getProperties(
  rawFilters: Partial<PropertyFilters>
): Promise<PaginatedResponse<Property>> {
  const filters = propertyFiltersSchema.parse(rawFilters);
  const { properties, total } = await repo.findManyProperties(filters);
  return {
    data: properties,
    meta: {
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    },
  };
}

export async function getFeaturedProperties(): Promise<Property[]> {
  return repo.findFeaturedProperties(2);
}

export async function getPropertyById(id: string): Promise<Property | null> {
  propertyIdSchema.parse(id);
  return repo.findPropertyById(id);
}

export async function createProperty(input: CreatePropertyInput): Promise<Property> {
  const data = createPropertySchema.parse(input);
  return repo.createProperty(data);
}

export async function updateProperty(id: string, input: UpdatePropertyInput): Promise<Property> {
  const data = updatePropertySchema.parse(input);
  return repo.updateProperty(id, data);
}

export async function deleteProperty(id: string): Promise<void> {
  await repo.deleteProperty(id);
}
