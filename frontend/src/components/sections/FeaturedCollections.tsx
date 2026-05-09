import { featuredProperties } from "@/lib/mockData";
import FeaturedPropertyCard from "@/components/ui/FeaturedPropertyCard";
import { ArrowRight } from "lucide-react";

export default function FeaturedCollections() {
  return (
    <section className="mb-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-nordic font-sf text-2xl font-light">Featured Collections</h2>
          <p className="text-nordic-muted mt-1 text-sm">
            Curated properties for the discerning eye.
          </p>
        </div>
        <a
          href="#"
          className="text-mosque hidden items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70 sm:flex"
        >
          View all <ArrowRight size={16} />
        </a>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {featuredProperties.map((property) => (
          <FeaturedPropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}
