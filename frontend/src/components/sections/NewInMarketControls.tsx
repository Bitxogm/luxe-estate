"use client";

import { useRouter, useSearchParams } from "next/navigation";

const TABS = [
  { label: "All", value: "all" },
  { label: "Buy", value: "sale" },
  { label: "Rent", value: "rent" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

interface NewInMarketControlsProps {
  activeTab: TabValue;
}

export default function NewInMarketControls({ activeTab }: NewInMarketControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTab = (value: TabValue) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (value === "all") {
      params.delete("priceType");
    } else {
      params.set("priceType", value);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="dark:bg-nordic-muted/10 hidden rounded-lg border border-transparent bg-white p-1 transition-colors md:flex dark:border-white/10">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => handleTab(tab.value)}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            activeTab === tab.value
              ? "bg-nordic dark:bg-clear-day dark:text-nordic text-white shadow-sm"
              : "text-nordic-muted dark:text-clear-day/70 hover:text-nordic dark:hover:text-clear-day"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
