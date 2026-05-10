import { getProperties } from "@/server/services/property.service";
import PropertyCard from "@/components/ui/PropertyCard";
import NewInMarketControls from "@/components/sections/NewInMarketControls";

interface NewInMarketProps {
  priceType?: "sale" | "rent";
  page?: number;
}

export default async function NewInMarket({ priceType, page = 1 }: NewInMarketProps) {
  const { data: properties, meta } = await getProperties({
    priceType,
    page,
    limit: 8,
  });

  return (
    <section>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-nordic dark:text-clear-day font-sf text-2xl font-light transition-colors">
            New in Market
          </h2>
          <p className="text-nordic-muted dark:text-clear-day/70 mt-1 text-sm transition-colors">
            Fresh opportunities added this week.
          </p>
        </div>
        <NewInMarketControls activeTab={priceType ?? "all"} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {meta.totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center space-x-2">
          {Array.from({ length: meta.totalPages }).map((_, i) => (
            <a
              key={i}
              href={`?page=${i + 1}${priceType ? `&priceType=${priceType}` : ""}`}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                meta.page === i + 1
                  ? "bg-mosque dark:bg-hint-green dark:text-mosque text-white shadow-md"
                  : "border-nordic/10 text-nordic dark:text-clear-day hover:bg-nordic/5 border dark:border-white/10 dark:hover:bg-white/5"
              }`}
            >
              {i + 1}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
