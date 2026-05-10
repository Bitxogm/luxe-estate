import { getFeaturedProperties } from "@/server/services/property.service";
import FeaturedPropertyCard from "@/components/ui/FeaturedPropertyCard";
import { ArrowRight } from "lucide-react";

export default async function FeaturedCollections() {
  const properties = await getFeaturedProperties();

  return (
    <section className="mb-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-sf text-2xl font-light text-nordic transition-colors dark:text-clear-day">
            Featured Collections
          </h2>
          <p className="mt-1 text-sm text-nordic-muted transition-colors dark:text-clear-day/70">
            Curated properties for the discerning eye.
          </p>
        </div>
        <a
          href="#"
          className="hidden items-center gap-1 text-sm font-medium text-mosque transition-all hover:opacity-70 dark:text-hint-green sm:flex"
        >
          View all <ArrowRight size={16} />
        </a>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {properties.map((property) => (
          <FeaturedPropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}
