"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deletePropertyAction } from "@/server/actions/property.action";
import { notify } from "@/lib/toast";
import { useRouter } from "next/navigation";

interface DeletePropertyButtonProps {
  propertyId: string;
  propertyTitle: string;
}

export default function DeletePropertyButton({
  propertyId,
  propertyTitle,
}: DeletePropertyButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    startTransition(async () => {
      const result = await deletePropertyAction(propertyId);
      if (result.error) {
        notify.error(result.error);
      } else {
        notify.success(`"${propertyTitle}" deleted`);
        router.refresh();
      }
      setConfirming(false);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      onBlur={() => setConfirming(false)}
      title={confirming ? "Click again to confirm" : "Delete property"}
      className={`flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-medium transition-all disabled:opacity-50 ${
        confirming
          ? "bg-red-500 text-white hover:bg-red-600"
          : "text-nordic/40 hover:bg-red-50 hover:text-red-600 dark:text-clear-day/40 dark:hover:bg-red-900/20 dark:hover:text-red-400"
      }`}
    >
      <Trash2 size={16} />
      {confirming && <span>Confirm</span>}
    </button>
  );
}
