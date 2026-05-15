"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Crown } from "lucide-react";
import { createSubscriptionCheckoutAction } from "@/server/actions/payment.action";
import { notify } from "@/lib/toast";

export default function ProButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handlePro() {
    setIsLoading(true);
    const result = await createSubscriptionCheckoutAction();
    if ("error" in result) {
      notify.error(result.error);
      setIsLoading(false);
      return;
    }
    router.push(result.url);
  }

  return (
    <button
      onClick={handlePro}
      disabled={isLoading}
      className="inline-flex items-center gap-2 rounded-lg bg-nordic px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-nordic/90 hover:shadow-lg disabled:opacity-50 dark:bg-hint-green dark:text-nordic"
    >
      <Crown size={16} />
      {isLoading ? "Redirecting…" : "Go Pro — 29.99€/mo"}
    </button>
  );
}
