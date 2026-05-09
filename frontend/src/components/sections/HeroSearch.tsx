"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

const FILTERS = ["All", "House", "Apartment", "Villa", "Penthouse"] as const;

export default function HeroSearch() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl space-y-8 text-center">
        <h1 className="text-nordic font-sf text-4xl font-light leading-tight md:text-5xl lg:text-6xl">
          Find your{" "}
          <span className="relative inline-block">
            <span className="relative z-10 font-medium">sanctuary</span>
            <span className="bg-mosque/20 absolute bottom-2 left-0 z-0 h-3 w-full -rotate-1" />
          </span>
          .
        </h1>

        <div className="group relative mx-auto max-w-2xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search
              size={22}
              className="text-nordic-muted group-focus-within:text-mosque transition-colors"
            />
          </div>
          <input
            type="text"
            placeholder="Search by city, neighborhood, or address..."
            className="text-nordic shadow-soft placeholder-nordic-muted/60 focus:ring-mosque block w-full rounded-xl border-none bg-white py-4 pl-12 pr-4 text-lg transition-all focus:bg-white focus:outline-none focus:ring-2"
          />
          <button className="bg-mosque hover:bg-mosque/90 shadow-mosque/20 absolute inset-y-2 right-2 flex items-center justify-center rounded-lg px-6 font-medium text-white shadow-lg transition-colors">
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
                  ? "bg-nordic shadow-nordic/10 text-white shadow-lg"
                  : "border-nordic/5 text-nordic-muted hover:text-nordic hover:border-mosque/50 hover:bg-mosque/5 border bg-white"
              }`}
            >
              {filter}
            </button>
          ))}
          <div className="bg-nordic/10 mx-2 h-6 w-px" />
          <button className="text-nordic flex items-center gap-1 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5">
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>
      </div>
    </section>
  );
}
