"use client";

import { Tag } from "lucide-react";
import { notify } from "@/lib/toast";

interface PropertyActionsProps {
  isRent: boolean;
  propertyTitle: string;
}

export default function PropertyActions({ isRent, propertyTitle }: PropertyActionsProps) {
  function handleEnquiry() {
    notify.info(
      isRent
        ? "Viewing request sent. We'll contact you shortly."
        : "Enquiry sent. An agent will reach out within 24h."
    );
  }

  function handleSave() {
    notify.success(`"${propertyTitle}" saved to your favourites.`);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        onClick={handleEnquiry}
        className="flex-1 rounded-xl bg-mosque px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-mosque/90"
      >
        {isRent ? "Request a viewing" : "Make an enquiry"}
      </button>
      <button
        onClick={handleSave}
        className="flex-1 rounded-xl border border-nordic/20 px-6 py-3.5 text-sm font-semibold text-nordic transition-colors hover:bg-nordic/5 dark:border-white/10 dark:text-clear-day dark:hover:bg-white/5"
      >
        <Tag size={15} className="mr-2 inline" />
        Save property
      </button>
    </div>
  );
}
