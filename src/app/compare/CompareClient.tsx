"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, GitCompare, Trash2, Star, Bath, BedDouble, Ruler } from "lucide-react";
import { useCompare } from "@/lib/compare-context";
import { getPropertiesWithRatingsAction } from "@/server/actions/compare.action";

export default function CompareClient() {
  const { properties, removeProperty, isInitialized } = useCompare();
  const [ratings, setRatings] = useState<Record<string, { average: number; count: number }>>({});

  useEffect(() => {
    if (properties.length >= 2) {
      getPropertiesWithRatingsAction(properties.map((p) => p.id)).then((res) => {
        if (res.ratings) {
          setRatings(res.ratings);
        }
      });
    }
  }, [properties]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-mosque border-t-transparent" />
      </div>
    );
  }

  function getHighlightClass(
    currentVal: number,
    allVals: number[],
    lowerIsBetter: boolean = false
  ): string {
    if (allVals.length < 2) return "";

    // Check if all values are equal
    const allEqual = allVals.every((v) => v === allVals[0]);
    if (allEqual) return "";

    const targetVal = lowerIsBetter ? Math.min(...allVals) : Math.max(...allVals);
    const worstVal = lowerIsBetter ? Math.max(...allVals) : Math.min(...allVals);

    if (currentVal === targetVal) {
      return "text-mosque bg-hint-green/20 dark:text-hint-green dark:bg-hint-green/10 font-bold";
    }
    if (currentVal === worstVal) {
      return "text-nordic/40 dark:text-clear-day/40";
    }
    return "";
  }

  const priceValues = properties.map((p) => p.price);
  const sqmValues = properties.map((p) => p.sqm);
  const bedsValues = properties.map((p) => p.beds);
  const bathsValues = properties.map((p) => p.baths);
  const ratingValues = properties.map((p) => ratings[p.id]?.average ?? 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-nordic-muted transition-colors hover:text-nordic dark:text-clear-day/60 dark:hover:text-clear-day"
        >
          <ArrowLeft size={16} />
          Back to homes
        </Link>
      </div>

      {properties.length < 2 ? (
        /* Empty State */
        <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-nordic/20 py-16 text-center dark:border-white/10">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-hint-green/20 text-mosque dark:bg-hint-green/10 dark:text-hint-green">
            <GitCompare size={32} />
          </div>
          <h2 className="font-sf text-2xl font-light text-nordic dark:text-clear-day">
            Select at least 2 properties to compare
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-nordic-muted dark:text-clear-day/60">
            Explore our exclusive listings and click the compare icon on any property card to view
            side-by-side details.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-mosque px-6 py-3 text-sm font-bold text-white shadow-soft transition-all hover:bg-mosque/90 dark:bg-hint-green dark:text-nordic dark:hover:bg-hint-green/90"
          >
            Browse properties
          </Link>
        </div>
      ) : (
        /* Specs Table Layout */
        <div>
          <div className="mb-8">
            <h1 className="font-sf text-3xl font-light text-nordic dark:text-clear-day">
              Compare Properties
            </h1>
            <p className="mt-1 text-sm text-nordic-muted dark:text-clear-day/60">
              LuxeEstate side-by-side dynamic comparison sheet
            </p>
          </div>

          <div className="hide-scroll overflow-x-auto rounded-2xl border border-nordic/10 bg-white shadow-soft dark:border-white/10 dark:bg-nordic-muted/10">
            <table className="w-full table-fixed border-collapse text-left">
              <thead>
                <tr className="border-b border-nordic/10 dark:border-white/10">
                  {/* First Cell: Specification Title */}
                  <th className="w-64 bg-clear-day/10 px-6 py-6 text-sm font-bold text-nordic/40 dark:bg-transparent dark:text-clear-day/40">
                    Features
                  </th>
                  {properties.map((prop) => {
                    const isRent = prop.priceType === "rent";
                    const formattedPrice = isRent
                      ? `${prop.price.toLocaleString("es-ES")}€`
                      : new Intl.NumberFormat("es-ES", {
                          style: "currency",
                          currency: "EUR",
                          maximumFractionDigits: 0,
                        }).format(prop.price);

                    return (
                      <th key={prop.id} className="relative min-w-[280px] p-6 align-top">
                        {/* Remove Button */}
                        <button
                          onClick={() => removeProperty(prop.id)}
                          className="absolute right-4 top-4 rounded-lg bg-red-50 p-2 text-red-500 transition-colors hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20"
                          aria-label="Remove from compare"
                        >
                          <Trash2 size={16} />
                        </button>

                        {/* Property Details Header Card */}
                        <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl">
                          <Image
                            src={prop.imageUrl}
                            alt={prop.title}
                            fill
                            className="object-cover"
                            sizes="320px"
                          />
                          <div className="absolute bottom-3 left-3 rounded bg-nordic/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white">
                            {prop.status}
                          </div>
                        </div>

                        <Link
                          href={`/properties/${prop.slug}`}
                          className="line-clamp-1 block font-sf text-base font-semibold text-nordic transition-colors hover:text-mosque dark:text-clear-day dark:hover:text-hint-green"
                        >
                          {prop.title}
                        </Link>

                        <p className="mt-1 truncate text-xs text-nordic-muted dark:text-clear-day/65">
                          {prop.address}
                        </p>

                        <div className="mt-3 text-lg font-bold text-mosque dark:text-hint-green">
                          {formattedPrice}
                          {isRent && (
                            <span className="text-xs font-normal text-nordic-muted dark:text-clear-day/60">
                              /mo
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-nordic/10 dark:divide-white/10">
                {/* Price Specification */}
                <tr className="bg-clear-day/10 dark:bg-white/5">
                  <td className="px-6 py-4 text-sm font-semibold text-nordic dark:text-clear-day">
                    Price Tag
                  </td>
                  {properties.map((prop) => {
                    const isRent = prop.priceType === "rent";
                    const formattedPrice = isRent
                      ? `${prop.price.toLocaleString("es-ES")}€`
                      : new Intl.NumberFormat("es-ES", {
                          style: "currency",
                          currency: "EUR",
                          maximumFractionDigits: 0,
                        }).format(prop.price);

                    return (
                      <td
                        key={prop.id}
                        className={`px-6 py-4 text-sm font-bold ${getHighlightClass(
                          prop.price,
                          priceValues,
                          true // lower price is better
                        )}`}
                      >
                        {formattedPrice}
                        {isRent && <span className="text-xs font-normal">/mo</span>}
                      </td>
                    );
                  })}
                </tr>

                {/* Surface Area (sqm) */}
                <tr>
                  <td className="px-6 py-4 text-sm font-semibold text-nordic dark:text-clear-day">
                    Surface Area
                  </td>
                  {properties.map((prop) => (
                    <td
                      key={prop.id}
                      className={`px-6 py-4 text-sm ${getHighlightClass(prop.sqm, sqmValues)}`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Ruler size={14} className="text-nordic-muted" />
                        <span>{prop.sqm} m²</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Bedrooms */}
                <tr className="bg-clear-day/10 dark:bg-white/5">
                  <td className="px-6 py-4 text-sm font-semibold text-nordic dark:text-clear-day">
                    Bedrooms
                  </td>
                  {properties.map((prop) => (
                    <td
                      key={prop.id}
                      className={`px-6 py-4 text-sm ${getHighlightClass(prop.beds, bedsValues)}`}
                    >
                      <div className="flex items-center gap-1.5">
                        <BedDouble size={14} className="text-nordic-muted" />
                        <span>
                          {prop.beds} {prop.beds === 1 ? "Bed" : "Beds"}
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Bathrooms */}
                <tr>
                  <td className="px-6 py-4 text-sm font-semibold text-nordic dark:text-clear-day">
                    Bathrooms
                  </td>
                  {properties.map((prop) => (
                    <td
                      key={prop.id}
                      className={`px-6 py-4 text-sm ${getHighlightClass(prop.baths, bathsValues)}`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Bath size={14} className="text-nordic-muted" />
                        <span>
                          {prop.baths} {prop.baths === 1 ? "Bath" : "Baths"}
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* City */}
                <tr className="bg-clear-day/10 dark:bg-white/5">
                  <td className="px-6 py-4 text-sm font-semibold text-nordic dark:text-clear-day">
                    Location / City
                  </td>
                  {properties.map((prop) => (
                    <td key={prop.id} className="px-6 py-4 text-sm text-nordic dark:text-clear-day">
                      {prop.city}
                    </td>
                  ))}
                </tr>

                {/* Property Type */}
                <tr>
                  <td className="px-6 py-4 text-sm font-semibold text-nordic dark:text-clear-day">
                    Property Type
                  </td>
                  {properties.map((prop) => (
                    <td key={prop.id} className="px-6 py-4 text-sm text-nordic dark:text-clear-day">
                      {prop.type}
                    </td>
                  ))}
                </tr>

                {/* Deal Type */}
                <tr className="bg-clear-day/10 dark:bg-white/5">
                  <td className="px-6 py-4 text-sm font-semibold text-nordic dark:text-clear-day">
                    Deal Type
                  </td>
                  {properties.map((prop) => (
                    <td key={prop.id} className="px-6 py-4 text-sm text-nordic dark:text-clear-day">
                      <span className="capitalize">{prop.priceType}</span>
                    </td>
                  ))}
                </tr>

                {/* Featured Status */}
                <tr>
                  <td className="px-6 py-4 text-sm font-semibold text-nordic dark:text-clear-day">
                    Featured Status
                  </td>
                  {properties.map((prop) => (
                    <td key={prop.id} className="px-6 py-4 text-sm">
                      {prop.isFeatured ? (
                        <span className="inline-flex rounded bg-mosque/15 px-2 py-0.5 text-xs font-bold text-mosque dark:bg-hint-green/20 dark:text-hint-green">
                          Exclusive
                        </span>
                      ) : (
                        <span className="text-nordic-muted/60 dark:text-clear-day/40">
                          Standard
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Rating Promedio */}
                <tr className="bg-clear-day/10 dark:bg-white/5">
                  <td className="px-6 py-4 text-sm font-semibold text-nordic dark:text-clear-day">
                    Average Rating
                  </td>
                  {properties.map((prop) => {
                    const reviewData = ratings[prop.id];
                    const average = reviewData?.average ?? 0;
                    const count = reviewData?.count ?? 0;

                    return (
                      <td
                        key={prop.id}
                        className={`px-6 py-4 text-sm ${getHighlightClass(average, ratingValues)}`}
                      >
                        {count > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{average}★</span>
                            <span className="text-xs text-nordic-muted/80 dark:text-clear-day/60">
                              ({count} {count === 1 ? "review" : "reviews"})
                            </span>
                          </div>
                        ) : (
                          <span className="text-nordic-muted/50 dark:text-clear-day/40">
                            No reviews yet
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
