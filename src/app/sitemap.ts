import { prisma } from "@/lib/prisma";

export default async function sitemap() {
  const properties = await prisma.property.findMany({
    select: { slug: true, updatedAt: true },
  });

  const propertyUrls = properties.map((p) => ({
    url: `https://luxe-estate-frontend-tau.vercel.app/properties/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://luxe-estate-frontend-tau.vercel.app",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    ...propertyUrls,
  ];
}
