import { z } from "zod";

export const propertyIdSchema = z
  .string()
  .regex(/^[a-z0-9]+$/, "ID inválido")
  .min(1)
  .max(64);

export const propertyFiltersSchema = z.object({
  priceType: z.enum(["sale", "rent"]).optional(),
  type: z.enum(["House", "Apartment", "Villa", "Penthouse"]).optional(),
  city: z.string().min(1).max(100).optional(),
  featured: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(8),
});

export const createPropertySchema = z.object({
  title: z.string().min(1).max(200),
  address: z.string().min(1).max(300),
  city: z.string().min(1).max(100),
  price: z.number().positive(),
  priceType: z.enum(["sale", "rent"]),
  beds: z.number().int().min(0),
  baths: z.number().min(0),
  sqm: z.number().positive(),
  type: z.enum(["House", "Apartment", "Villa", "Penthouse"]),
  status: z.enum(["FOR SALE", "FOR RENT"]),
  badge: z.enum(["Exclusive", "New Arrival", "Price Drop"]).optional(),
  imageUrl: z.string().url(),
  imageAlt: z.string().min(1).max(200),
  isFeatured: z.boolean().default(false),
});

export const updatePropertySchema = createPropertySchema.partial();

export type PropertyFilters = z.infer<typeof propertyFiltersSchema>;
export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
