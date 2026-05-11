"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createProperty } from "@/server/services/property.service";
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
