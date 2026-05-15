"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { createFeaturedCheckoutAction } from "@/server/actions/payment.action";
import { notify } from "@/lib/toast";

interface Props {
  propertyId: string;
  isFeatured: boolean;
}

export default function FeaturedButton({ propertyId, isFeatured }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (isFeatured) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-hint-green px-2.5 py-1 text-xs font-semibold text-mosque dark:bg-hint-green/20 dark:text-hint-green">
        <Zap size={11} />
        Featured
      </span>
    );
  }

  async function handleBoost() {
    setIsLoading(true);
    const result = await createFeaturedCheckoutAction(propertyId);
    if ("error" in result) {
      notify.error(result.error);
      setIsLoading(false);
      return;
    }
    router.push(result.url);
  }

  return (
    <button
      onClick={handleBoost}
      disabled={isLoading}
      className="inline-flex items-center gap-1.5 rounded-lg border border-mosque/20 bg-white px-3 py-1.5 text-xs font-medium text-mosque transition-colors hover:bg-mosque hover:text-white disabled:opacity-50 dark:border-hint-green/20 dark:bg-transparent dark:text-hint-green dark:hover:bg-hint-green dark:hover:text-nordic"
    >
      <Zap size={12} />
      {isLoading ? "Redirecting…" : "Boost — 9.99€"}
    </button>
  );
}
