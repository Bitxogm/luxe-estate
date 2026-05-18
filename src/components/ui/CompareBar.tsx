"use client";

import { useCompare } from "@/lib/compare-context";
import { X, GitCompare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CompareBar() {
  const { properties, removeProperty, clearAll, isInitialized } = useCompare();

  if (!isInitialized || properties.length === 0) {
    return null;
  }

  const slots = Array.from({ length: 3 });

  return (
    <div className="animate-slide-up fixed bottom-6 left-1/2 z-50 w-[95%] max-w-3xl -translate-x-1/2">
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-nordic/95 p-4 text-white shadow-2xl backdrop-blur-md md:flex-row md:items-center md:justify-between md:gap-0">
        {/* Left: Miniatures */}
        <div className="flex items-center gap-3">
          {slots.map((_, index) => {
            const prop = properties[index];
            if (prop) {
              return (
                <div
                  key={prop.id}
                  className="group relative h-14 w-14 overflow-hidden rounded-xl border border-white/10 bg-white/5"
                >
                  <Image
                    src={prop.imageUrl}
                    alt={prop.title}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                  <button
                    onClick={() => removeProperty(prop.id)}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-transform hover:scale-110"
                    aria-label="Remove property"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            } else {
              return (
                <div
                  key={`empty-${index}`}
                  className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-white/5 text-white/30"
                >
                  <GitCompare size={16} />
                </div>
              );
            }
          })}
          <div className="ml-2 hidden sm:block">
            <p className="text-xs font-semibold text-clear-day">
              Comparing {properties.length} {properties.length === 1 ? "property" : "properties"}
            </p>
            <p className="text-[10px] text-white/50">Max 3 properties</p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-3 md:border-t-0 md:pt-0">
          <button
            onClick={clearAll}
            className="rounded-xl px-4 py-2.5 text-xs font-semibold text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            Clear all
          </button>

          <Link
            href="/compare"
            className={`flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              properties.length >= 2
                ? "bg-mosque text-white hover:bg-mosque/90 dark:bg-hint-green dark:text-nordic dark:hover:bg-hint-green/90"
                : "pointer-events-none cursor-not-allowed bg-white/10 text-white/40"
            }`}
            aria-disabled={properties.length < 2}
          >
            Compare now
          </Link>
        </div>
      </div>
    </div>
  );
}
