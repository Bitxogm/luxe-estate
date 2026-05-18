import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSavedProperties } from "@/server/actions/saved.action";
import Navbar from "@/components/sections/Navbar";
import PropertyCard from "@/components/ui/PropertyCard";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Properties",
  description: "Your saved luxury properties on Luxe Estate",
};

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/favorites");

  const properties = await getSavedProperties();

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-sf text-3xl font-bold tracking-tight text-nordic dark:text-clear-day md:text-4xl">
              Your Favorites
            </h1>
            <p className="mt-2 text-nordic/70 dark:text-clear-day/70">
              {properties.length > 0
                ? `You have ${properties.length} saved ${properties.length === 1 ? "property" : "properties"} waiting for you.`
                : "You haven't saved any properties yet."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} isSaved={true} />
          ))}

          <Link
            href="/"
            className="group flex min-h-[360px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-mosque/30 bg-hint-green/20 p-6 text-center transition-all duration-300 hover:border-mosque hover:shadow-md dark:border-white/20 dark:bg-white/5 dark:hover:border-hint-green"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-hint-green transition-transform group-hover:scale-110 dark:bg-white/10">
              <Plus size={28} className="text-mosque dark:text-hint-green" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-nordic dark:text-clear-day">
              Discover More
            </h3>
            <p className="mb-6 max-w-[180px] text-sm text-nordic/70 dark:text-clear-day/70">
              Find more properties that match your lifestyle.
            </p>
            <span className="rounded-lg bg-mosque px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-mosque/30 transition-all group-hover:shadow-mosque/50 dark:bg-hint-green dark:text-nordic">
              Browse Listings
            </span>
          </Link>
        </div>
      </main>
    </>
  );
}
