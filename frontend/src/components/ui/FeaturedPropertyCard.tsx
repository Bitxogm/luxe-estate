import type { FeaturedProperty } from "@/types/property";
import { Bath, BedDouble, MapPin, Heart, Ruler } from "lucide-react";
import Image from "next/image";

interface FeaturedPropertyCardProps {
  property: FeaturedProperty;
}

export default function FeaturedPropertyCard({ property }: FeaturedPropertyCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <div className="shadow-soft dark:bg-nordic-muted/10 group relative cursor-pointer overflow-hidden rounded-xl bg-white transition-colors dark:border dark:border-white/5">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={property.imageUrl}
          alt={property.imageAlt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="text-nordic absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
          {property.badge}
        </div>
        <button className="text-nordic hover:bg-mosque absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all hover:text-white dark:bg-black/50 dark:text-white">
          <Heart size={18} />
        </button>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
      </div>

      <div className="p-6">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="text-nordic dark:text-clear-day group-hover:text-mosque dark:group-hover:text-hint-green text-xl font-medium transition-colors">
              {property.title}
            </h3>
            <p className="text-nordic-muted dark:text-clear-day/70 mt-1 flex items-center gap-1 text-sm">
              <MapPin size={14} /> {property.address}
            </p>
          </div>
          <span className="text-mosque dark:text-hint-green text-xl font-semibold">
            {formattedPrice}
          </span>
        </div>

        <div className="border-nordic/5 mt-6 flex items-center gap-6 border-t pt-6 dark:border-white/10">
          <div className="text-nordic-muted dark:text-clear-day/70 flex items-center gap-2 text-sm">
            <BedDouble size={18} /> {property.beds} Beds
          </div>
          <div className="text-nordic-muted dark:text-clear-day/70 flex items-center gap-2 text-sm">
            <Bath size={18} /> {property.baths} Baths
          </div>
          <div className="text-nordic-muted dark:text-clear-day/70 flex items-center gap-2 text-sm">
            <Ruler size={18} /> {property.sqm.toLocaleString()} m²
          </div>
        </div>
      </div>
    </div>
  );
}
