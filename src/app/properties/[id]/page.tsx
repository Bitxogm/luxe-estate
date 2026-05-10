import { notFound } from "next/navigation";
import { getPropertyById } from "@/server/services/property.service";
import Navbar from "@/components/sections/Navbar";
import PropertyDetail from "@/components/properties/PropertyDetail";
import type { Metadata } from "next";
import { ZodError } from "zod";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const property = await getPropertyById(id);
    if (!property) return { title: "Propiedad no encontrada — Luxe Estate" };
    return {
      title: `${property.title} — Luxe Estate`,
      description: `${property.type} en ${property.city}. ${property.beds} beds · ${property.baths} baths · ${property.sqm} m²`,
    };
  } catch {
    return { title: "Luxe Estate" };
  }
}

export default async function PropertyPage({ params }: Props) {
  let property;

  try {
    const { id } = await params;
    property = await getPropertyById(id);
  } catch (error) {
    if (error instanceof ZodError) notFound();
    throw error;
  }

  if (!property) notFound();

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <PropertyDetail property={property} />
      </main>
    </>
  );
}
