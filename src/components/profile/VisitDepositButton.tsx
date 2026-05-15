"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
import { createVisitDepositCheckoutAction } from "@/server/actions/payment.action";
import { notify } from "@/lib/toast";

interface Props {
  visitId: string;
}

export default function VisitDepositButton({ visitId }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleDeposit() {
    setIsLoading(true);
    const result = await createVisitDepositCheckoutAction(visitId);
    if ("error" in result) {
      notify.error(result.error);
      setIsLoading(false);
      return;
    }
    router.push(result.url);
  }

  return (
    <button
      onClick={handleDeposit}
      disabled={isLoading}
      className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-mosque px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-mosque/90 disabled:opacity-50 dark:bg-hint-green dark:text-nordic dark:hover:bg-hint-green/90"
    >
      <CreditCard size={12} />
      {isLoading ? "Redirecting…" : "Confirm with deposit — 50€"}
    </button>
  );
}
