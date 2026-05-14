"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import { deletePropertyAction } from "@/server/actions/property.action";
import { notify } from "@/lib/toast";

interface PropertyActionsProps {
  isRent: boolean;
  propertySlug: string;
  propertyId: string;
  isOwner?: boolean;
}

export default function PropertyActions({
  isRent,
  propertySlug,
  propertyId,
  isOwner,
}: PropertyActionsProps) {
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deletePropertyAction(propertyId);
    if (result.error) {
      notify.error(result.error);
      setIsDeleting(false);
      setConfirmDelete(false);
      return;
    }
    notify.success("Property deleted");
    router.push("/dashboard");
  }

  return (
    <div className="space-y-3">
      <Link
        href={`/properties/${propertySlug}/schedule`}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-mosque px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-mosque/90 dark:bg-hint-green dark:text-nordic dark:hover:bg-hint-green/90"
      >
        <Calendar size={16} />
        {isRent ? "Schedule a viewing" : "Schedule a visit"}
      </Link>

      {isOwner && (
        <div className="flex gap-3">
          <Link
            href={`/properties/${propertySlug}/edit`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-nordic/20 bg-white px-6 py-3.5 text-sm font-semibold text-nordic transition-colors hover:bg-nordic/5 dark:border-white/10 dark:bg-transparent dark:text-clear-day dark:hover:bg-white/5"
          >
            <Pencil size={16} />
            Edit listing
          </Link>

          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-6 py-3.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <Trash2 size={16} />
              Delete
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={isDeleting}
                className="rounded-xl border border-nordic/20 px-4 py-3.5 text-sm font-medium text-nordic/60 transition-colors hover:text-nordic disabled:opacity-50 dark:border-white/10 dark:text-clear-day/60 dark:hover:text-clear-day"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-xl bg-red-600 px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting…" : "Confirm"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
