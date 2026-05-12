"use client";

import Link from "next/link";
import { Calendar, Pencil } from "lucide-react";

interface PropertyActionsProps {
  isRent: boolean;
  propertySlug: string;
  isOwner?: boolean;
}

export default function PropertyActions({ isRent, propertySlug, isOwner }: PropertyActionsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link
        href={`/properties/${propertySlug}/schedule`}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-mosque px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-mosque/90 dark:bg-hint-green dark:text-nordic dark:hover:bg-hint-green/90"
      >
        <Calendar size={16} />
        {isRent ? "Schedule a viewing" : "Schedule a visit"}
      </Link>
      {isOwner && (
        <Link
          href={`/properties/${propertySlug}/edit`}
          className="flex items-center justify-center gap-2 rounded-xl border border-nordic/20 bg-white px-6 py-3.5 text-sm font-semibold text-nordic transition-colors hover:bg-nordic/5 dark:border-white/10 dark:bg-transparent dark:text-clear-day dark:hover:bg-white/5"
        >
          <Pencil size={16} />
          Edit listing
        </Link>
      )}
    </div>
  );
}
