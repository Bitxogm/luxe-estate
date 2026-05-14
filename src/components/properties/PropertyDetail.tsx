import type { Property } from "@prisma/client";
import Link from "next/link";
import { Bath, BedDouble, Ruler, MapPin, ArrowLeft } from "lucide-react";
import PropertyActions from "./PropertyActions";
import PropertyGallery from "./PropertyGallery";

interface PropertyDetailProps {
  property: Property;
  isOwner?: boolean;
}

export default function PropertyDetail({ property, isOwner }: PropertyDetailProps) {
  const isRent = property.priceType === "rent";

  const formattedPrice = isRent
    ? `$${property.price.toLocaleString("en-US")}/mo`
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(property.price);

  return (
    <div className="pt-8">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-nordic-muted transition-colors hover:text-mosque dark:text-clear-day/60 dark:hover:text-hint-green"
      >
        <ArrowLeft size={16} />
        Back to listings
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Gallery */}
        <div className="relative">
          <PropertyGallery
            imageUrl={property.imageUrl}
            images={property.images}
            imageAlt={property.imageAlt}
          />
          <div
            className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-bold text-white ${
              isRent ? "bg-mosque/90" : "bg-nordic/90"
            }`}
          >
            {property.status}
          </div>
          {property.badge && (
            <div className="absolute right-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-nordic backdrop-blur-sm">
              {property.badge}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-mosque dark:text-hint-green">
              {property.type}
            </span>
          </div>

          <h1 className="mb-3 font-sf text-3xl font-light text-nordic dark:text-clear-day lg:text-4xl">
            {property.title}
          </h1>

          <p className="mb-6 flex items-center gap-1.5 text-sm text-nordic-muted dark:text-clear-day/60">
            <MapPin size={15} />
            {property.address}
          </p>

          <p className="mb-8 font-sf text-3xl font-semibold text-mosque dark:text-hint-green">
            {formattedPrice}
          </p>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-3 gap-4 rounded-xl border border-nordic/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
            <div className="text-center">
              <div className="mb-1 flex items-center justify-center gap-1.5 text-lg font-semibold text-nordic dark:text-clear-day">
                <BedDouble size={18} className="text-mosque dark:text-hint-green" />
                {property.beds}
              </div>
              <p className="text-xs text-nordic-muted dark:text-clear-day/50">Bedrooms</p>
            </div>
            <div className="border-nordic/10 text-center dark:border-white/10 sm:border-x">
              <div className="mb-1 flex items-center justify-center gap-1.5 text-lg font-semibold text-nordic dark:text-clear-day">
                <Bath size={18} className="text-mosque dark:text-hint-green" />
                {property.baths}
              </div>
              <p className="text-xs text-nordic-muted dark:text-clear-day/50">Bathrooms</p>
            </div>
            <div className="text-center">
              <div className="mb-1 flex items-center justify-center gap-1.5 text-lg font-semibold text-nordic dark:text-clear-day">
                <Ruler size={18} className="text-mosque dark:text-hint-green" />
                {property.sqm.toLocaleString()}
              </div>
              <p className="text-xs text-nordic-muted dark:text-clear-day/50">m²</p>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div className="mb-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-nordic/40 dark:text-clear-day/40">
                About this property
              </h2>
              <p className="text-sm leading-relaxed text-nordic-muted dark:text-clear-day/70">
                {property.description}
              </p>
            </div>
          )}

          {/* CTA */}
          <PropertyActions isRent={isRent} propertySlug={property.slug} isOwner={isOwner} />
        </div>
      </div>
    </div>
  );
}
