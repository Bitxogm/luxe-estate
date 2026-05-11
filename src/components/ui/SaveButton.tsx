"use client";

import { Heart } from "lucide-react";
import { useState, useTransition } from "react";
import { toggleSaveProperty } from "@/server/actions/saved.action";
import { notify } from "@/lib/toast";
import { useRouter } from "next/navigation";

interface SaveButtonProps {
  propertyId: string;
  initialSaved: boolean;
  className?: string;
}

export default function SaveButton({ propertyId, initialSaved, className }: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const result = await toggleSaveProperty(propertyId);

      if ("error" in result) {
        router.push("/login");
        return;
      }

      setSaved(result.saved);
      notify.success(result.saved ? "Property saved" : "Property removed from saved");
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label={saved ? "Remove from saved" : "Save property"}
      className={className}
    >
      <Heart
        size={18}
        className={saved ? "fill-mosque text-mosque dark:fill-hint-green dark:text-hint-green" : ""}
      />
    </button>
  );
}
