"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createProperty, updateProperty, deleteProperty } from "@/server/services/property.service";
import { generateUniqueSlug } from "@/lib/slug";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  address: z.string().min(1, "Address is required").max(300),
  city: z.string().min(1, "City is required").max(100),
  price: z.coerce.number().positive("Price must be positive"),
  priceType: z.enum(["sale", "rent"]),
  beds: z.coerce.number().int().min(0),
  baths: z.coerce.number().min(0),
  sqm: z.coerce.number().positive("Area must be positive"),
  type: z.enum(["House", "Apartment", "Villa", "Penthouse"]),
  badge: z.enum(["Exclusive", "New Arrival", "Price Drop"]).optional(),
  imageUrl: z.string().url("Must be a valid URL"),
  imageAlt: z.string().min(1).max(200),
  isFeatured: z.coerce.boolean().optional().default(false),
});

export async function createPropertyAction(
  _prev: unknown,
  formData: FormData
): Promise<{ errors: Record<string, string> }> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/properties/new");

  const raw = Object.fromEntries(formData.entries());
  raw.isFeatured = formData.get("isFeatured") === "on" ? "true" : "false";
  if (!raw.badge) delete raw.badge;

  const result = formSchema.safeParse(raw);
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.errors.forEach((e) => {
      if (e.path[0]) errors[String(e.path[0])] = e.message;
    });
    return { errors };
  }

  const data = result.data;

  const existingSlugs = await prisma.property.findMany({ select: { slug: true } });
  const slugSet = new Set(existingSlugs.map((p) => p.slug));
  const slug = generateUniqueSlug(data.title, slugSet);

  const status = data.priceType === "sale" ? ("FOR SALE" as const) : ("FOR RENT" as const);

  const property = await createProperty({
    ...data,
    slug,
    status,
    badge: data.badge ?? undefined,
    isFeatured: data.isFeatured ?? false,
    imageAlt: data.imageAlt || data.title,
  });

  redirect(`/properties/${property.slug}`);
}

export async function updatePropertyAction(
  _prev: unknown,
  formData: FormData
): Promise<{ errors: Record<string, string> }> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const propertyId = formData.get("propertyId") as string;
  const existing = await prisma.property.findUnique({ where: { id: propertyId } });

  if (!existing) return { errors: { _: "Property not found" } };
  if (existing.userId !== session.user.id && session.user.role !== "admin") {
    return { errors: { _: "Unauthorized" } };
  }

  const raw = Object.fromEntries(formData.entries());
  raw.isFeatured = formData.get("isFeatured") === "on" ? "true" : "false";
  if (!raw.badge) delete raw.badge;

  const result = formSchema.safeParse(raw);
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.errors.forEach((e) => {
      if (e.path[0]) errors[String(e.path[0])] = e.message;
    });
    return { errors };
  }

  const data = result.data;
  const status = data.priceType === "sale" ? ("FOR SALE" as const) : ("FOR RENT" as const);

  await updateProperty(existing.id, {
    ...data,
    status,
    badge: data.badge ?? undefined,
  });

  redirect(`/properties/${existing.slug}`);
}

export async function deletePropertyAction(propertyId: string): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const existing = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!existing) return { error: "Not found" };
  if (existing.userId !== session.user.id && session.user.role !== "admin") {
    return { error: "Unauthorized" };
  }

  await deleteProperty(propertyId);
  revalidatePath("/dashboard");
  return {};
}
