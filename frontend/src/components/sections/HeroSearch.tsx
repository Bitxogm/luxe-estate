"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

const FILTERS = ["All", "House", "Apartment", "Villa", "Penthouse"] as const;

export default function HeroSearch() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl space-y-8 text-center">
        <h1 className="text-nordic dark:text-clear-day font-sf text-4xl font-light leading-tight transition-colors md:text-5xl lg:text-6xl">
          Find your{" "}
          <span className="relative inline-block">
            <span className="relative z-10 font-medium">sanctuary</span>
            <span className="bg-mosque/20 dark:bg-hint-green/30 absolute bottom-2 left-0 z-0 h-3 w-full -rotate-1 transition-colors" />
          </span>
          .
        </h1>

        <div className="group relative mx-auto max-w-2xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search
              size={22}
              className="text-nordic-muted dark:text-clear-day/50 group-focus-within:text-mosque dark:group-focus-within:text-hint-green transition-colors"
            />
          </div>
          <input
            type="text"
            placeholder="Search by city, neighborhood, or address..."
            className="text-nordic dark:text-clear-day shadow-soft placeholder-nordic-muted/60 dark:placeholder-clear-day/50 focus:ring-mosque dark:focus:ring-hint-green dark:bg-nordic-muted/10 dark:focus:bg-nordic-muted/20 block w-full rounded-xl border-none bg-white py-4 pl-12 pr-4 text-lg transition-all focus:bg-white focus:outline-none focus:ring-2 dark:border dark:border-white/10 dark:shadow-none"
          />
          <button className="bg-mosque dark:bg-hint-green hover:bg-mosque/90 dark:hover:bg-hint-green/90 shadow-mosque/20 dark:text-mosque absolute inset-y-2 right-2 flex items-center justify-center rounded-lg px-6 font-medium text-white shadow-lg transition-colors">
            Search
          </button>
        </div>

        <div className="hide-scroll -mx-4 flex items-center justify-center gap-3 overflow-x-auto px-4 py-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all hover:-translate-y-0.5 ${
                activeFilter === filter
                  ? "bg-nordic dark:bg-clear-day shadow-nordic/10 dark:text-nordic text-white shadow-lg"
                  : "border-nordic/5 text-nordic-muted dark:text-clear-day/70 hover:text-nordic dark:hover:text-clear-day hover:border-mosque/50 dark:hover:border-hint-green/50 hover:bg-mosque/5 dark:bg-nordic-muted/10 border bg-white dark:border-white/10 dark:hover:bg-white/5"
              }`}
            >
              {filter}
            </button>
          ))}
          <div className="bg-nordic/10 dark:bg-clear-day/20 mx-2 h-6 w-px transition-colors" />
          <button className="text-nordic dark:text-clear-day flex items-center gap-1 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10">
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>
      </div>
    </section>
  );
}
