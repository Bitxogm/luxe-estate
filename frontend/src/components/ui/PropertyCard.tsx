import type { Property } from "@/types/property";
import { Bath, BedDouble, Ruler, Heart } from "lucide-react";
import Image from "next/image";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const isRent = property.priceType === "rent";

  const formattedPrice = isRent
    ? `$${property.price.toLocaleString("en-US")}`
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(property.price);

  return (
    <article className="shadow-card hover:shadow-soft dark:bg-nordic-muted/10 group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl bg-white transition-all duration-300 dark:border dark:border-white/5">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.imageUrl}
          alt={property.imageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <button className="hover:bg-mosque text-nordic absolute right-3 top-3 rounded-full bg-white/90 p-2 transition-colors hover:text-white dark:bg-black/50 dark:text-white">
          <Heart size={18} />
        </button>
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
          <h3 className="text-nordic dark:text-clear-day text-lg font-bold">
            {formattedPrice}
            {isRent && (
              <span className="text-nordic-muted dark:text-clear-day/70 text-sm font-normal">
                /mo
              </span>
            )}
          </h3>
        </div>
        <h4 className="text-nordic dark:text-clear-day mb-1 truncate font-medium">
          {property.title}
        </h4>
        <p className="text-nordic-muted dark:text-clear-day/70 mb-4 text-xs">{property.address}</p>

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 dark:border-white/10">
          <div className="text-nordic-muted dark:text-clear-day/70 flex items-center gap-1 text-xs">
            <BedDouble size={14} className="text-mosque/80 dark:text-hint-green/80" />{" "}
            {property.beds}
          </div>
          <div className="text-nordic-muted dark:text-clear-day/70 flex items-center gap-1 text-xs">
            <Bath size={14} className="text-mosque/80 dark:text-hint-green/80" /> {property.baths}
          </div>
          <div className="text-nordic-muted dark:text-clear-day/70 flex items-center gap-1 text-xs">
            <Ruler size={14} className="text-mosque/80 dark:text-hint-green/80" /> {property.sqm}m²
          </div>
        </div>
      </div>
    </article>
  );
}
