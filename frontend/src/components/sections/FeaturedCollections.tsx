import { getFeaturedProperties } from "@/server/services/property.service";
import FeaturedPropertyCard from "@/components/ui/FeaturedPropertyCard";
import { ArrowRight } from "lucide-react";

export default async function FeaturedCollections() {
  const properties = await getFeaturedProperties();

  return (
    <section className="mb-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-nordic dark:text-clear-day font-sf text-2xl font-light transition-colors">
            Featured Collections
          </h2>
          <p className="text-nordic-muted dark:text-clear-day/70 mt-1 text-sm transition-colors">
            Curated properties for the discerning eye.
          </p>
        </div>
        <a
          href="#"
          className="text-mosque dark:text-hint-green hidden items-center gap-1 text-sm font-medium transition-all hover:opacity-70 sm:flex"
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
