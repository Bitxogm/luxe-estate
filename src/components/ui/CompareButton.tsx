"use client";

import { GitCompare } from "lucide-react";
import { useCompare } from "@/lib/compare-context";
import type { Property } from "@prisma/client";

interface CompareButtonProps {
  property: Property;
  className?: string;
}

export default function CompareButton({ property, className }: CompareButtonProps) {
  const { isSelected, addProperty, removeProperty } = useCompare();
  const isCompared = isSelected(property.id);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (isCompared) {
      removeProperty(property.id);
    } else {
      addProperty(property);
    }
  }

  return (
    <button
      onClick={handleClick}
      aria-label={isCompared ? "Remove from compare" : "Add to compare"}
      className={`${className} ${
        isCompared
          ? "bg-hint-green text-mosque dark:bg-hint-green dark:text-mosque"
          : "bg-white/90 text-nordic hover:bg-mosque hover:text-white dark:bg-black/50 dark:text-white"
      }`}
    >
      <GitCompare size={18} />
    </button>
  );
}
