"use client";

import { useState } from "react";
import { newInMarketProperties } from "@/lib/mockData";
import PropertyCard from "@/components/ui/PropertyCard";
import type { Property } from "@/types/property";

const TABS = ["All", "Buy", "Rent"] as const;
type Tab = (typeof TABS)[number];

export default function NewInMarket() {
  const [activeTab, setActiveTab] = useState<Tab>("All");

  const filtered = newInMarketProperties.filter((p: Property) => {
    if (activeTab === "Buy") return p.priceType === "sale";
    if (activeTab === "Rent") return p.priceType === "rent";
    return true;
  });

  return (
    <section>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-nordic font-sf text-2xl font-light">New in Market</h2>
          <p className="text-nordic-muted mt-1 text-sm">Fresh opportunities added this week.</p>
        </div>
        <div className="hidden rounded-lg bg-white p-1 md:flex">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-nordic text-white shadow-sm"
                  : "text-nordic-muted hover:text-nordic"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <button className="border-nordic/10 hover:border-mosque hover:text-mosque text-nordic rounded-lg border bg-white px-8 py-3 font-medium transition-all hover:shadow-md">
          Load more properties
        </button>
      </div>
    </section>
  );
}
