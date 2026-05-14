import { notFound } from "next/navigation";
import { getPropertyBySlug } from "@/server/services/property.service";
import { auth } from "@/auth";
import Navbar from "@/components/sections/Navbar";
import PropertyDetail from "@/components/properties/PropertyDetail";
import type { Metadata } from "next";
import { ZodError } from "zod";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const property = await getPropertyBySlug(slug);
    if (!property) return { title: "Property not found — Luxe Estate" };
    return {
      title: `${property.title} — Luxe Estate`,
      description: `${property.type} in ${property.city}. ${property.beds} beds · ${property.baths} baths · ${property.sqm} m²`,
    };
  } catch {
    return { title: "Luxe Estate" };
  }
}

export default async function PropertyPage({ params }: Props) {
  let property;

  try {
    const { slug } = await params;
    property = await getPropertyBySlug(slug);
  } catch (error) {
    if (error instanceof ZodError) notFound();
    throw error;
  }

  if (!property) notFound();

  const session = await auth();
  const isOwner =
    !!session?.user?.id && (session.user.id === property.userId || session.user.role === "admin");

  console.log("DEBUG isOwner:", {
    sessionUserId: session?.user?.id,
    propertyUserId: property.userId,
    role: session?.user?.role,
    isOwner,
  });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <PropertyDetail property={property} isOwner={isOwner} />
      </main>
    </>
  );
}
