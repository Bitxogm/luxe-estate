"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, User, LayoutDashboard, Shield, PlusCircle, Settings } from "lucide-react";
import { notify } from "@/lib/toast";

interface NavbarUserMenuProps {
  name?: string | null;
  email?: string | null;
  role?: string | null;
  image?: string | null;
}

export default function NavbarUserMenu({ name, email, role, image }: NavbarUserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  function handleLinkClick() {
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
        aria-expanded={isOpen}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-hint-green text-sm font-semibold text-mosque ring-2 ring-transparent transition-all hover:ring-mosque dark:bg-mosque dark:text-hint-green dark:hover:ring-hint-green"
      >
        {image ? (
          <Image
            src={image}
            alt={name ?? "Avatar"}
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </button>

      <div
        className={`absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-nordic/10 bg-white shadow-soft backdrop-blur-md transition-all duration-200 dark:border-white/10 dark:bg-nordic-muted/90 ${
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        {/* User info */}
        <div className="border-b border-nordic/10 px-4 py-3 dark:border-white/10">
          <p className="truncate text-sm font-medium text-nordic dark:text-clear-day">
            {name ?? "User"}
          </p>
          <p className="truncate text-xs text-nordic-muted dark:text-clear-day/50">{email}</p>
        </div>

        {/* Main nav group */}
        <div className="py-1">
          <Link
            href="/profile"
            onClick={handleLinkClick}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-nordic transition-colors hover:bg-nordic/5 dark:text-clear-day dark:hover:bg-white/5"
          >
            <User size={15} className="text-nordic/50 dark:text-clear-day/50" /> My Profile
          </Link>
          <Link
            href="/dashboard"
            onClick={handleLinkClick}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-nordic transition-colors hover:bg-nordic/5 dark:text-clear-day dark:hover:bg-white/5"
          >
            <LayoutDashboard size={15} className="text-nordic/50 dark:text-clear-day/50" /> My
            Dashboard
          </Link>
          {role === "admin" && (
            <Link
              href="/admin/users"
              onClick={handleLinkClick}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-mosque transition-colors hover:bg-mosque/5 dark:text-hint-green dark:hover:bg-hint-green/5"
            >
              <Shield size={15} /> Admin Panel
            </Link>
          )}
          <Link
            href="/properties/new"
            onClick={handleLinkClick}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-nordic transition-colors hover:bg-nordic/5 dark:text-clear-day dark:hover:bg-white/5"
          >
            <PlusCircle size={15} className="text-nordic/50 dark:text-clear-day/50" /> List Property
          </Link>
        </div>

        {/* Settings group */}
        <div className="border-t border-nordic/10 py-1 dark:border-white/10">
          <Link
            href="/profile?tab=settings"
            onClick={handleLinkClick}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-nordic transition-colors hover:bg-nordic/5 dark:text-clear-day dark:hover:bg-white/5"
          >
            <Settings size={15} className="text-nordic/50 dark:text-clear-day/50" /> Account
            Settings
          </Link>
        </div>

        {/* Sign out */}
        <div className="border-t border-nordic/10 py-1 dark:border-white/10">
          <button
            onClick={() => {
              handleLinkClick();
              handleSignOut();
            }}
            className="flex w-full items-center gap-2.5 rounded-b-xl px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
