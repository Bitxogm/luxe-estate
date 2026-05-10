"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { notify } from "@/lib/toast";

interface NavbarUserMenuProps {
  name?: string | null;
  email?: string | null;
}

export default function NavbarUserMenu({ name, email }: NavbarUserMenuProps) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : (email?.[0]?.toUpperCase() ?? "U");

  async function handleSignOut() {
    await signOut({ redirect: false });
    notify.info("Signed out.");
    window.location.href = "/";
  }

  return (
    <div className="group relative">
      <button
        aria-label="User menu"
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-hint-green text-sm font-semibold text-mosque ring-2 ring-transparent transition-all hover:ring-mosque dark:bg-mosque dark:text-hint-green dark:hover:ring-hint-green"
      >
        {initials}
      </button>
      <div className="pointer-events-none absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-nordic/10 bg-white opacity-0 shadow-soft backdrop-blur-md transition-all group-focus-within:pointer-events-auto group-focus-within:opacity-100 dark:border-white/10 dark:bg-nordic-muted/90">
        <div className="border-b border-nordic/10 px-4 py-3 dark:border-white/10">
          <p className="truncate text-sm font-medium text-nordic dark:text-clear-day">
            {name ?? "User"}
          </p>
          <p className="truncate text-xs text-nordic-muted dark:text-clear-day/50">{email}</p>
        </div>
        <Link
          href="/profile"
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-nordic transition-colors hover:bg-nordic/5 dark:text-clear-day dark:hover:bg-white/5"
        >
          <User size={15} /> Profile
        </Link>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2 rounded-b-xl px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </div>
  );
}
