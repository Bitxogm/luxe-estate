"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";
import { Search } from "lucide-react";

export default function UserSearchInput({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [value, setValue] = useState(defaultValue);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setValue(q);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    q ? params.set("q", q) : params.delete("q");
    startTransition(() => router.push(`?${params.toString()}`));
  }

  return (
    <div className="relative w-full md:w-80">
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-nordic/40 dark:text-clear-day/40"
      />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search by name or email…"
        className="block w-full rounded-lg border-none bg-white py-2.5 pl-9 pr-3 text-sm text-nordic placeholder-nordic/30 shadow-sm outline-none ring-2 ring-transparent transition-all focus:ring-mosque dark:bg-white/5 dark:text-clear-day dark:placeholder-clear-day/30 dark:focus:ring-hint-green"
      />
    </div>
  );
}
