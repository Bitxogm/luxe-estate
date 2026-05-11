import { getProperties } from "@/server/services/property.service";
import { auth } from "@/auth";
import * as repo from "@/server/repositories/property.repository";
import PropertyCard from "@/components/ui/PropertyCard";
import NewInMarketControls from "@/components/sections/NewInMarketControls";
import SearchFiltersModal from "@/components/sections/SearchFiltersModal";

interface NewInMarketProps {
  priceType?: "sale" | "rent";
  type?: "House" | "Apartment" | "Villa" | "Penthouse";
  city?: string;
  page?: number;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
}

function buildPageUrl(
  page: number,
  priceType?: string,
  type?: string,
  city?: string,
  minPrice?: number,
  maxPrice?: number,
  minBeds?: number,
  minBaths?: number
): string {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (priceType) params.set("priceType", priceType);
  if (type) params.set("type", type);
  if (city) params.set("city", city);
  if (minPrice !== undefined) params.set("minPrice", String(minPrice));
  if (maxPrice !== undefined) params.set("maxPrice", String(maxPrice));
  if (minBeds !== undefined) params.set("minBeds", String(minBeds));
  if (minBaths !== undefined) params.set("minBaths", String(minBaths));
  return `?${params.toString()}`;
}

export default async function NewInMarket({
  priceType,
  type,
  city,
  page = 1,
  minPrice,
  maxPrice,
  minBeds,
  minBaths,
}: NewInMarketProps) {
  const session = await auth();
  const [{ data: properties, meta }, savedIds] = await Promise.all([
    getProperties({ priceType, type, city, page, limit: 8, minPrice, maxPrice, minBeds, minBaths }),
    session?.user?.id
      ? repo.getSavedPropertyIds(session.user.id)
      : Promise.resolve(new Set<string>()),
  ]);

  return (
    <section>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-sf text-2xl font-light text-nordic transition-colors dark:text-clear-day">
            New in Market
          </h2>
          <p className="mt-1 text-sm text-nordic-muted transition-colors dark:text-clear-day/70">
            Fresh opportunities added this week.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <NewInMarketControls activeTab={priceType ?? "all"} />
          <SearchFiltersModal
            city={city}
            type={type}
            minPrice={minPrice}
            maxPrice={maxPrice}
            minBeds={minBeds}
            minBaths={minBaths}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} isSaved={savedIds.has(property.id)} />
        ))}
      </div>

      {meta.totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center space-x-2">
          <a
            href={buildPageUrl(
              meta.page - 1,
              priceType,
              type,
              city,
              minPrice,
              maxPrice,
              minBeds,
              minBaths
            )}
            aria-disabled={meta.page === 1}
            className={`rounded-lg border border-nordic/10 px-4 py-2 text-sm font-medium text-nordic transition-colors hover:bg-nordic/5 dark:border-white/10 dark:text-clear-day dark:hover:bg-white/5 ${
              meta.page === 1 ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Previous
          </a>

          <div className="hidden space-x-2 sm:flex">
            {Array.from({ length: meta.totalPages }).map((_, i) => (
              <a
                key={i}
                href={buildPageUrl(
                  i + 1,
                  priceType,
                  type,
                  city,
                  minPrice,
                  maxPrice,
                  minBeds,
                  minBaths
                )}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  meta.page === i + 1
                    ? "bg-mosque text-white shadow-md dark:bg-hint-green dark:text-mosque"
                    : "border border-nordic/10 text-nordic hover:bg-nordic/5 dark:border-white/10 dark:text-clear-day dark:hover:bg-white/5"
                }`}
              >
                {i + 1}
              </a>
            ))}
          </div>

          <a
            href={buildPageUrl(
              meta.page + 1,
              priceType,
              type,
              city,
              minPrice,
              maxPrice,
              minBeds,
              minBaths
            )}
            aria-disabled={meta.page === meta.totalPages}
            className={`rounded-lg border border-nordic/10 px-4 py-2 text-sm font-medium text-nordic transition-colors hover:bg-nordic/5 dark:border-white/10 dark:text-clear-day dark:hover:bg-white/5 ${
              meta.page === meta.totalPages ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Next
          </a>
        </div>
      )}
    </section>
  );
}
