import type { Property } from "@prisma/client";
import { Bath, BedDouble, Ruler } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SaveButton from "@/components/ui/SaveButton";

interface PropertyCardProps {
  property: Property;
  isSaved?: boolean;
}

export default function PropertyCard({ property, isSaved = false }: PropertyCardProps) {
  const isRent = property.priceType === "rent";

  const formattedPrice = isRent
    ? `${property.price.toLocaleString("es-ES")}€`
    : new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(property.price);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-card transition-all duration-300 hover:shadow-soft dark:border dark:border-white/5 dark:bg-nordic-muted/10">
      <Link href={`/properties/${property.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={property.imageUrl}
            alt={property.imageAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <SaveButton
            propertyId={property.id}
            initialSaved={isSaved}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-nordic transition-colors hover:bg-mosque hover:text-white dark:bg-black/50 dark:text-white"
          />
          <div
            className={`absolute bottom-3 left-3 rounded px-2 py-1 text-xs font-bold text-white ${
              property.status === "FOR RENT" ? "bg-mosque/90" : "bg-nordic/90"
            }`}
          >
            {property.status}
          </div>
        </div>

        <div className="flex flex-grow flex-col p-4">
          <div className="mb-2 flex items-baseline justify-between">
            <h3 className="text-lg font-bold text-nordic dark:text-clear-day">
              {formattedPrice}
              {isRent && (
                <span className="text-sm font-normal text-nordic-muted dark:text-clear-day/70">
                  /mo
                </span>
              )}
            </h3>
          </div>
          <h4 className="mb-1 truncate font-medium text-nordic dark:text-clear-day">
            {property.title}
          </h4>
          <p className="mb-4 text-xs text-nordic-muted dark:text-clear-day/70">
            {property.address}
          </p>

          <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 dark:border-white/10">
            <div className="flex items-center gap-1 text-xs text-nordic-muted dark:text-clear-day/70">
              <BedDouble size={14} className="text-mosque/80 dark:text-hint-green/80" />{" "}
              {property.beds}
            </div>
            <div className="flex items-center gap-1 text-xs text-nordic-muted dark:text-clear-day/70">
              <Bath size={14} className="text-mosque/80 dark:text-hint-green/80" /> {property.baths}
            </div>
            <div className="flex items-center gap-1 text-xs text-nordic-muted dark:text-clear-day/70">
              <Ruler size={14} className="text-mosque/80 dark:text-hint-green/80" /> {property.sqm}
              m²
            </div>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <Link
          href={`/properties/${property.slug}/schedule`}
          className="block w-full rounded-lg border border-mosque/20 py-2 text-center text-xs font-medium text-mosque transition-colors hover:bg-mosque hover:text-white dark:border-hint-green/30 dark:text-hint-green dark:hover:bg-hint-green/20"
        >
          Schedule Tour
        </Link>
      </div>
    </article>
  );
}
