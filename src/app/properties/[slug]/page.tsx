import { notFound } from "next/navigation";
import { getPropertyBySlug } from "@/server/services/property.service";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getReviewsByPropertyId } from "@/server/repositories/review.repository";
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

    if (!property) {
      return { title: "Property not found" };
    }

    const title = property.title;
    const description =
      property.description ??
      `${property.type} in ${property.city}. ${property.beds} beds, ${property.baths} baths, ${property.sqm}m². ${
        property.priceType === "sale" ? "For sale" : "For rent"
      } at ${property.price.toLocaleString("es-ES")}€`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: property.imageUrl,
            width: 1200,
            height: 630,
            alt: property.imageAlt || property.title,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [property.imageUrl],
      },
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
  const isOwner = !!session?.user?.id && session.user.id === property.userId;

  let existingConversationId: string | undefined;
  if (session?.user?.id && !isOwner) {
    const conv = await prisma.conversation.findUnique({
      where: { propertyId_buyerId: { propertyId: property.id, buyerId: session.user.id } },
      select: { id: true },
    });
    existingConversationId = conv?.id;
  }

  const { reviews, averageRating } = await getReviewsByPropertyId(property.id);
  const isAdmin = session?.user?.role === "admin";
  const currentUserId = session?.user?.id;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <PropertyDetail
          property={property}
          isOwner={isOwner}
          isLoggedIn={!!session?.user?.id}
          existingConversationId={existingConversationId}
          reviews={reviews}
          averageRating={averageRating}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
        />
      </main>
    </>
  );
}
