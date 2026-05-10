import type { Property } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, Ruler, MapPin, ArrowLeft, Tag } from "lucide-react";

interface PropertyDetailProps {
  property: Property;
}

export default function PropertyDetail({ property }: PropertyDetailProps) {
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
        className="text-nordic-muted dark:text-clear-day/60 hover:text-mosque dark:hover:text-hint-green mb-8 inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft size={16} />
        Back to listings
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Imagen */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image
            src={property.imageUrl}
            alt={property.imageAlt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold text-white ${
              isRent ? "bg-mosque/90" : "bg-nordic/90"
            }`}
          >
            {property.status}
          </div>
          {property.badge && (
            <div className="text-nordic absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              {property.badge}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-mosque dark:text-hint-green text-xs font-semibold uppercase tracking-widest">
              {property.type}
            </span>
          </div>

          <h1 className="text-nordic dark:text-clear-day font-sf mb-3 text-3xl font-light lg:text-4xl">
            {property.title}
          </h1>

          <p className="text-nordic-muted dark:text-clear-day/60 mb-6 flex items-center gap-1.5 text-sm">
            <MapPin size={15} />
            {property.address}
          </p>

          <p className="text-mosque dark:text-hint-green font-sf mb-8 text-3xl font-semibold">
            {formattedPrice}
          </p>

          {/* Stats */}
          <div className="border-nordic/10 mb-8 grid grid-cols-3 gap-4 rounded-xl border bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
            <div className="text-center">
              <div className="text-nordic dark:text-clear-day mb-1 flex items-center justify-center gap-1.5 text-lg font-semibold">
                <BedDouble size={18} className="text-mosque dark:text-hint-green" />
                {property.beds}
              </div>
              <p className="text-nordic-muted dark:text-clear-day/50 text-xs">Bedrooms</p>
            </div>
            <div className="border-nordic/10 text-center sm:border-x dark:border-white/10">
              <div className="text-nordic dark:text-clear-day mb-1 flex items-center justify-center gap-1.5 text-lg font-semibold">
                <Bath size={18} className="text-mosque dark:text-hint-green" />
                {property.baths}
              </div>
              <p className="text-nordic-muted dark:text-clear-day/50 text-xs">Bathrooms</p>
            </div>
            <div className="text-center">
              <div className="text-nordic dark:text-clear-day mb-1 flex items-center justify-center gap-1.5 text-lg font-semibold">
                <Ruler size={18} className="text-mosque dark:text-hint-green" />
                {property.sqm.toLocaleString()}
              </div>
              <p className="text-nordic-muted dark:text-clear-day/50 text-xs">m²</p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="bg-mosque hover:bg-mosque/90 flex-1 rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition-colors">
              {isRent ? "Request a viewing" : "Make an enquiry"}
            </button>
            <button className="border-nordic/20 text-nordic dark:text-clear-day hover:bg-nordic/5 flex-1 rounded-xl border px-6 py-3.5 text-sm font-semibold transition-colors dark:border-white/10 dark:hover:bg-white/5">
              <Tag size={15} className="mr-2 inline" />
              Save property
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
