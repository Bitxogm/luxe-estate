import type { Property } from "@prisma/client";
import { Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SaveButton from "@/components/ui/SaveButton";

interface FeaturedPropertyCardProps {
  property: Property;
  isSaved?: boolean;
}

export default function FeaturedPropertyCard({
  property,
  isSaved = false,
}: FeaturedPropertyCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <Link href={`/properties/${property.slug}`} className="block">
      <div className="group relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-soft transition-colors dark:border dark:border-white/5 dark:bg-nordic-muted/10">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={property.imageUrl}
            alt={property.imageAlt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {property.badge && (
            <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-nordic backdrop-blur-sm">
              {property.badge}
            </div>
          )}
          <SaveButton
            propertyId={property.id}
            initialSaved={isSaved}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-nordic backdrop-blur-sm transition-all hover:bg-mosque hover:text-white dark:bg-black/50 dark:text-white"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
        </div>

        <div className="p-6">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h3 className="text-xl font-medium text-nordic transition-colors group-hover:text-mosque dark:text-clear-day dark:group-hover:text-hint-green">
                {property.title}
              </h3>
              <p className="mt-1 flex items-center gap-1 text-sm text-nordic-muted dark:text-clear-day/70">
                <MapPin size={14} /> {property.address}
              </p>
            </div>
            <span className="text-xl font-semibold text-mosque dark:text-hint-green">
              {formattedPrice}
            </span>
          </div>

          <div className="mt-6 flex items-center gap-6 border-t border-nordic/5 pt-6 dark:border-white/10">
            <div className="flex items-center gap-2 text-sm text-nordic-muted dark:text-clear-day/70">
              <BedDouble size={18} /> {property.beds} Beds
            </div>
            <div className="flex items-center gap-2 text-sm text-nordic-muted dark:text-clear-day/70">
              <Bath size={18} /> {property.baths} Baths
            </div>
            <div className="flex items-center gap-2 text-sm text-nordic-muted dark:text-clear-day/70">
              <Ruler size={18} /> {property.sqm.toLocaleString()} m²
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
