"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Minus, Plus } from "lucide-react";

const PROPERTY_TYPES = ["House", "Apartment", "Villa", "Penthouse"] as const;

interface SearchFiltersModalProps {
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
}

function Counter({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-nordic dark:text-clear-day">{label}</span>
      <div className="flex items-center gap-3 rounded-full bg-clear-day p-1 dark:bg-white/5">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-nordic/60 shadow-sm transition-colors hover:text-mosque dark:bg-nordic dark:text-clear-day/60 dark:hover:text-hint-green"
        >
          <Minus size={14} />
        </button>
        <span className="w-8 text-center text-sm font-semibold text-nordic dark:text-clear-day">
          {value === 0 ? "Any" : `${value}+`}
        </span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-mosque shadow-sm transition-colors hover:bg-mosque hover:text-white dark:bg-nordic dark:text-hint-green dark:hover:bg-hint-green dark:hover:text-nordic"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

export default function SearchFiltersModal({
  city: initCity = "",
  type: initType = "",
  minPrice: initMinPrice,
  maxPrice: initMaxPrice,
  minBeds: initMinBeds = 0,
  minBaths: initMinBaths = 0,
}: SearchFiltersModalProps) {
  const [open, setOpen] = useState(false);
  const [city, setCity] = useState(initCity);
  const [type, setType] = useState(initType);
  const [minPrice, setMinPrice] = useState(initMinPrice?.toString() ?? "");
  const [maxPrice, setMaxPrice] = useState(initMaxPrice?.toString() ?? "");
  const [minBeds, setMinBeds] = useState(initMinBeds);
  const [minBaths, setMinBaths] = useState(initMinBaths);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const activeFiltersCount = [city, type, minPrice, maxPrice, minBeds > 0, minBaths > 0].filter(
    Boolean
  ).length;

  function handleApply() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    city ? params.set("city", city) : params.delete("city");
    type ? params.set("type", type) : params.delete("type");
    minPrice ? params.set("minPrice", minPrice) : params.delete("minPrice");
    maxPrice ? params.set("maxPrice", maxPrice) : params.delete("maxPrice");
    minBeds > 0 ? params.set("minBeds", String(minBeds)) : params.delete("minBeds");
    minBaths > 0 ? params.set("minBaths", String(minBaths)) : params.delete("minBaths");

    startTransition(() => {
      router.push(`?${params.toString()}`);
      setOpen(false);
    });
  }

  function handleClear() {
    setCity("");
    setType("");
    setMinPrice("");
    setMaxPrice("");
    setMinBeds(0);
    setMinBaths(0);

    const params = new URLSearchParams(searchParams.toString());
    ["city", "type", "minPrice", "maxPrice", "minBeds", "minBaths"].forEach((k) =>
      params.delete(k)
    );
    params.set("page", "1");
    startTransition(() => {
      router.push(`?${params.toString()}`);
      setOpen(false);
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`relative flex items-center gap-2 rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors ${
          activeFiltersCount > 0
            ? "border-mosque bg-mosque text-white dark:border-hint-green dark:bg-hint-green dark:text-nordic"
            : "border-nordic/10 bg-white text-nordic hover:border-nordic/30 dark:border-white/10 dark:bg-nordic-muted/10 dark:text-clear-day"
        }`}
      >
        <SlidersHorizontal size={15} />
        Filters
        {activeFiltersCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-mosque dark:bg-nordic dark:text-hint-green">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-2xl -translate-y-1/2 overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-nordic sm:inset-x-auto sm:w-full">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-8 py-6 dark:border-white/10 dark:bg-nordic">
              <h2 className="text-2xl font-semibold tracking-tight text-nordic dark:text-clear-day">
                Filters
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-nordic/50 transition-colors hover:bg-gray-100 hover:text-nordic dark:text-clear-day/50 dark:hover:bg-white/10 dark:hover:text-clear-day"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] space-y-8 overflow-y-auto p-8">
              {/* City */}
              <section>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-nordic/50 dark:text-clear-day/50">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="City, neighborhood..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-lg border-0 bg-clear-day px-4 py-3 text-sm text-nordic shadow-sm outline-none ring-2 ring-transparent transition-all focus:bg-white focus:ring-mosque dark:bg-white/5 dark:text-clear-day dark:focus:bg-white/10 dark:focus:ring-hint-green"
                />
              </section>

              {/* Price range */}
              <section>
                <div className="mb-4 flex items-end justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-nordic/50 dark:text-clear-day/50">
                    Price Range
                  </label>
                  {(minPrice || maxPrice) && (
                    <span className="text-sm font-medium text-mosque dark:text-hint-green">
                      {minPrice ? `$${Number(minPrice).toLocaleString()}` : "$0"} –{" "}
                      {maxPrice ? `$${Number(maxPrice).toLocaleString()}` : "Any"}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-clear-day p-3 transition-colors focus-within:ring-1 focus-within:ring-mosque dark:bg-white/5 dark:focus-within:ring-hint-green">
                    <label className="mb-1 block text-[10px] font-medium uppercase text-nordic/50 dark:text-clear-day/50">
                      Min Price
                    </label>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-nordic/40 dark:text-clear-day/40">$</span>
                      <input
                        type="number"
                        min="0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="0"
                        className="w-full border-0 bg-transparent p-0 text-sm font-medium text-nordic outline-none focus:ring-0 dark:text-clear-day"
                      />
                    </div>
                  </div>
                  <div className="rounded-lg bg-clear-day p-3 transition-colors focus-within:ring-1 focus-within:ring-mosque dark:bg-white/5 dark:focus-within:ring-hint-green">
                    <label className="mb-1 block text-[10px] font-medium uppercase text-nordic/50 dark:text-clear-day/50">
                      Max Price
                    </label>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-nordic/40 dark:text-clear-day/40">$</span>
                      <input
                        type="number"
                        min="0"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Any"
                        className="w-full border-0 bg-transparent p-0 text-sm font-medium text-nordic outline-none focus:ring-0 dark:text-clear-day"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Property type + rooms */}
              <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-nordic/50 dark:text-clear-day/50">
                    Property Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full cursor-pointer rounded-lg border-0 bg-clear-day px-4 py-3 text-sm text-nordic outline-none ring-2 ring-transparent transition-all focus:ring-mosque dark:bg-white/5 dark:text-clear-day dark:focus:ring-hint-green"
                  >
                    <option value="">Any Type</option>
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  <Counter label="Bedrooms" value={minBeds} onChange={setMinBeds} />
                  <Counter label="Bathrooms" value={minBaths} onChange={setMinBaths} />
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex items-center justify-between border-t border-gray-100 bg-white px-8 py-6 dark:border-white/10 dark:bg-nordic">
              <button
                onClick={handleClear}
                className="text-sm font-medium text-nordic/50 underline underline-offset-4 transition-colors hover:text-nordic dark:text-clear-day/50 dark:hover:text-clear-day"
              >
                Clear all filters
              </button>
              <button
                onClick={handleApply}
                className="flex items-center gap-2 rounded-lg bg-mosque px-8 py-3 text-sm font-medium text-white shadow-lg shadow-mosque/30 transition-all hover:bg-nordic active:scale-95 dark:bg-hint-green dark:text-nordic dark:shadow-hint-green/20 dark:hover:bg-white"
              >
                Show Results
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
