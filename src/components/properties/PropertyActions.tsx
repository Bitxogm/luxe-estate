"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";

interface PropertyActionsProps {
  isRent: boolean;
  propertySlug: string;
}

export default function PropertyActions({ isRent, propertySlug }: PropertyActionsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link
        href={`/properties/${propertySlug}/schedule`}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-mosque px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-mosque/90 dark:bg-hint-green dark:text-nordic dark:hover:bg-hint-green/90"
      >
        <Calendar size={16} />
        {isRent ? "Schedule a viewing" : "Schedule a visit"}
      </Link>
    </div>
  );
}
