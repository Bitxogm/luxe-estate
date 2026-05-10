"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

const FILTERS = ["All", "House", "Apartment", "Villa", "Penthouse"] as const;
type Filter = (typeof FILTERS)[number];

export default function HeroSearch() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();
    if (activeFilter !== "All") params.set("type", activeFilter);
    if (query.trim()) params.set("city", query.trim());
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : "/");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSearch();
  }

  function handleFilterClick(filter: Filter) {
    setActiveFilter(filter);
  }

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl space-y-8 text-center">
        <h1 className="font-sf text-4xl font-light leading-tight text-nordic transition-colors dark:text-clear-day md:text-5xl lg:text-6xl">
          Find your{" "}
          <span className="relative inline-block">
            <span className="relative z-10 font-medium">sanctuary</span>
            <span className="absolute bottom-2 left-0 z-0 h-3 w-full -rotate-1 bg-mosque/20 transition-colors dark:bg-hint-green/30" />
          </span>
          .
        </h1>

        <div className="group relative mx-auto max-w-2xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search
              size={22}
              className="text-nordic-muted transition-colors group-focus-within:text-mosque dark:text-clear-day/50 dark:group-focus-within:text-hint-green"
            />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by city, neighborhood, or address..."
            className="block w-full rounded-xl border-none bg-white py-4 pl-12 pr-4 text-lg text-nordic placeholder-nordic-muted/60 shadow-soft transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-mosque dark:border dark:border-white/10 dark:bg-nordic-muted/10 dark:text-clear-day dark:placeholder-clear-day/50 dark:shadow-none dark:focus:bg-nordic-muted/20 dark:focus:ring-hint-green"
          />
          <button
            onClick={handleSearch}
            className="absolute inset-y-2 right-2 flex items-center justify-center rounded-lg bg-mosque px-6 font-medium text-white shadow-lg shadow-mosque/20 transition-colors hover:bg-mosque/90 dark:bg-hint-green dark:text-mosque dark:hover:bg-hint-green/90"
          >
            Search
          </button>
        </div>

        <div className="hide-scroll -mx-4 flex items-center justify-center gap-3 overflow-x-auto px-4 py-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all hover:-translate-y-0.5 ${
                activeFilter === filter
                  ? "bg-nordic text-white shadow-lg shadow-nordic/10 dark:bg-clear-day dark:text-nordic"
                  : "border border-nordic/5 bg-white text-nordic-muted hover:border-mosque/50 hover:bg-mosque/5 hover:text-nordic dark:border-white/10 dark:bg-nordic-muted/10 dark:text-clear-day/70 dark:hover:border-hint-green/50 dark:hover:bg-white/5 dark:hover:text-clear-day"
              }`}
            >
              {filter}
            </button>
          ))}
          <div className="mx-2 h-6 w-px bg-nordic/10 transition-colors dark:bg-clear-day/20" />
          <button className="flex items-center gap-1 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-nordic transition-colors hover:bg-black/5 dark:text-clear-day dark:hover:bg-white/10">
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>
      </div>
    </section>
  );
}
