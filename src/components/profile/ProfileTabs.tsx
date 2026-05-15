"use client";

import { useState } from "react";
import type { Prisma, Property } from "@prisma/client";
import PropertyCard from "@/components/ui/PropertyCard";
import PreferencesForm from "@/components/profile/PreferencesForm";
import VisitDepositButton from "@/components/profile/VisitDepositButton";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Clock, Heart, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type VisitWithProperty = Prisma.VisitGetPayload<{ include: { property: true } }>;
type Tab = "saved" | "visits" | "settings";

interface ProfileTabsProps {
  savedProperties: Property[];
  visits: VisitWithProperty[];
  name: string;
  email: string;
  image?: string | null;
  defaultTab?: Tab;
}

const TABS: { id: Tab; label: string; Icon: LucideIcon }[] = [
  { id: "saved", label: "Saved Properties", Icon: Heart },
  { id: "visits", label: "Scheduled Visits", Icon: Calendar },
  { id: "settings", label: "Account Settings", Icon: Settings },
];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  confirmed: "bg-hint-green text-mosque dark:bg-hint-green/20 dark:text-hint-green",
  cancelled: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

export default function ProfileTabs({
  savedProperties,
  visits,
  name,
  email,
  image,
  defaultTab,
}: ProfileTabsProps) {
  const [active, setActive] = useState<Tab>(defaultTab ?? "saved");

  return (
    <>
      <div className="mb-10 flex items-center gap-1 overflow-x-auto rounded-xl border border-nordic/10 bg-white p-1.5 shadow-sm dark:border-white/5 dark:bg-white/5">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              active === id
                ? "bg-mosque text-white shadow-sm dark:bg-hint-green dark:text-nordic"
                : "text-nordic/60 hover:bg-nordic/5 hover:text-nordic dark:text-clear-day/50 dark:hover:bg-white/5 dark:hover:text-clear-day"
            }`}
          >
            <Icon size={15} />
            {label}
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
        <div>
          {visits.length === 0 ? (
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
          ) : (
            <div className="space-y-4">
              {visits.map((visit) => {
                const date = new Date(visit.scheduledAt);
                const dateLabel = date.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
                const timeLabel = date.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <Link
                    key={visit.id}
                    href={`/properties/${visit.property.slug}`}
                    className="group flex items-center gap-5 rounded-xl border border-nordic/5 bg-white p-4 shadow-sm transition-all hover:border-mosque/20 hover:shadow-md dark:border-white/5 dark:bg-white/5 dark:hover:border-hint-green/20"
                  >
                    <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={visit.property.imageUrl}
                        alt={visit.property.imageAlt}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <h4 className="truncate font-semibold text-nordic transition-colors group-hover:text-mosque dark:text-clear-day dark:group-hover:text-hint-green">
                          {visit.property.title}
                        </h4>
                        <span
                          className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[visit.status] ?? STATUS_STYLES.pending}`}
                        >
                          {visit.status}
                        </span>
                      </div>
                      <p className="mb-2 flex items-center gap-1 truncate text-xs text-nordic/50 dark:text-clear-day/50">
                        <MapPin size={12} /> {visit.property.address}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-nordic/70 dark:text-clear-day/70">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-mosque dark:text-hint-green" />
                          {dateLabel}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-mosque dark:text-hint-green" />
                          {timeLabel}
                        </span>
                      </div>
                      {visit.status === "pending" && (
                        <div onClick={(e) => e.preventDefault()}>
                          <VisitDepositButton visitId={visit.id} />
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      {active === "settings" && <PreferencesForm name={name} email={email} image={image} />}
    </>
  );
}
