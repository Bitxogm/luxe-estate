"use client";

import { useState } from "react";
import type { Property } from "@prisma/client";
import PropertyCard from "@/components/ui/PropertyCard";
import PreferencesForm from "@/components/profile/PreferencesForm";
import Link from "next/link";
import { Calendar } from "lucide-react";

type Tab = "saved" | "visits" | "settings";

interface ProfileTabsProps {
  savedProperties: Property[];
  name: string;
  email: string;
}

const TABS: { id: Tab; label: string }[] = [
  { id: "saved", label: "Saved Properties" },
  { id: "visits", label: "Scheduled Visits" },
  { id: "settings", label: "Preferences & Settings" },
];

export default function ProfileTabs({ savedProperties, name, email }: ProfileTabsProps) {
  const [active, setActive] = useState<Tab>("saved");

  return (
    <>
      <div className="mb-10 flex items-center gap-8 overflow-x-auto border-b border-nordic/10 dark:border-white/10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`whitespace-nowrap border-b-2 px-2 pb-4 text-sm font-medium transition-colors ${
              active === tab.id
                ? "border-mosque text-nordic dark:border-hint-green dark:text-clear-day"
                : "border-transparent text-nordic/50 hover:border-nordic/20 hover:text-nordic dark:text-clear-day/50 dark:hover:text-clear-day"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {active === "saved" && (
        <div>
          {savedProperties.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <p className="mb-4 text-nordic/50 dark:text-clear-day/50">No saved properties yet.</p>
              <Link
                href="/"
                className="rounded-lg bg-mosque px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-nordic dark:bg-hint-green dark:text-nordic"
              >
                Browse listings
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {savedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} isSaved={true} />
              ))}
            </div>
          )}
        </div>
      )}

      {active === "visits" && (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-hint-green dark:bg-white/10">
            <Calendar size={28} className="text-mosque dark:text-hint-green" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-nordic dark:text-clear-day">
            No scheduled visits
          </h3>
          <p className="text-sm text-nordic/50 dark:text-clear-day/50">
            Schedule a visit from any property detail page.
          </p>
        </div>
      )}

      {active === "settings" && <PreferencesForm name={name} email={email} />}
    </>
  );
}
