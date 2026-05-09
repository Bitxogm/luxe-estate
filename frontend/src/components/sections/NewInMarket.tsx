"use client";

import { useState } from "react";
import { newInMarketProperties } from "@/lib/mockData";
import PropertyCard from "@/components/ui/PropertyCard";
import type { Property } from "@/types/property";

const TABS = ["All", "Buy", "Rent"] as const;
type Tab = (typeof TABS)[number];

export default function NewInMarket() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const filtered = newInMarketProperties.filter((p: Property) => {
    if (activeTab === "Buy") return p.priceType === "sale";
    if (activeTab === "Rent") return p.priceType === "rent";
    return true;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
        <div className="dark:bg-nordic-muted/10 hidden rounded-lg border border-transparent bg-white p-1 transition-colors md:flex dark:border-white/10">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-nordic dark:bg-clear-day dark:text-nordic text-white shadow-sm"
                  : "text-nordic-muted dark:text-clear-day/70 hover:text-nordic dark:hover:text-clear-day"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentItems.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="border-nordic/10 text-nordic dark:text-clear-day hover:bg-nordic/5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:hover:bg-white/5"
          >
            Previous
          </button>

          <div className="hidden space-x-2 sm:flex">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  currentPage === i + 1
                    ? "bg-mosque dark:bg-hint-green dark:text-mosque text-white shadow-md"
                    : "border-nordic/10 text-nordic dark:text-clear-day hover:bg-nordic/5 border dark:border-white/10 dark:hover:bg-white/5"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="border-nordic/10 text-nordic dark:text-clear-day hover:bg-nordic/5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:hover:bg-white/5"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
