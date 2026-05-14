"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Building2,
  LogOut,
  User,
  LayoutDashboard,
  Shield,
  PlusCircle,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { notify } from "@/lib/toast";

interface DrawerUser {
  name?: string | null;
  email?: string | null;
  role?: string | null;
}

interface MobileDrawerProps {
  user?: DrawerUser | null;
}

export default function MobileDrawer({ user }: MobileDrawerProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : (user?.email?.[0]?.toUpperCase() ?? "U");

  async function handleSignOut() {
    await signOut({ redirect: false });
    notify.info("Signed out.");
    window.location.href = "/";
  }

  const close = () => setOpen(false);

  return (
    <>
      {/* Hamburger — mobile only */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex items-center justify-center rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white md:hidden"
      >
        <Menu size={22} />
      </button>

      {/* Overlay */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-nordic/70 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-y-0 right-0 z-50 flex w-[75vw] max-w-[300px] flex-col bg-nordic transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
              <Building2 size={15} className="text-white" />
            </div>
            <span className="font-sf text-base font-semibold tracking-tight text-white">
              LuxeEstate
            </span>
          </div>
          <button
            onClick={close}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links — always visible */}
        <nav className="border-b border-white/10 py-2">
          <Link
            href="/?priceType=sale"
            onClick={close}
            className="block px-6 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            Buy
          </Link>
          <Link
            href="/?priceType=rent"
            onClick={close}
            className="block px-6 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            Rent
          </Link>
          {user && (
            <Link
              href="/properties/new"
              onClick={close}
              className="block px-6 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              Sell
            </Link>
          )}
        </nav>

        {/* User section */}
        <div className="mt-auto px-6 py-6">
          {user ? (
            <div className="space-y-1">
              {/* User info card */}
              <div className="mb-4 flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-hint-green text-sm font-semibold text-mosque">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{user.name ?? "User"}</p>
                  <p className="truncate text-xs text-white/40">{user.email}</p>
                </div>
              </div>

              <Link
                href="/profile"
                onClick={close}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              >
                <User size={15} /> My Profile
              </Link>
              <Link
                href="/dashboard"
                onClick={close}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              >
                <LayoutDashboard size={15} /> My Dashboard
              </Link>
              {user.role === "admin" && (
                <Link
                  href="/admin/users"
                  onClick={close}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-hint-green transition-colors hover:bg-hint-green/5"
                >
                  <Shield size={15} /> Admin Panel
                </Link>
              )}
              <Link
                href="/properties/new"
                onClick={close}
                className="flex items-center justify-center gap-2 rounded-lg bg-mosque px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-mosque/90"
              >
                <PlusCircle size={15} /> List Property
              </Link>

              <div className="border-t border-white/10 pt-1">
                <Link
                  href="/profile?tab=settings"
                  onClick={close}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <Settings size={15} /> Account Settings
                </Link>
              </div>

              <div className="border-t border-white/10 pt-1">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                >
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={close}
                className="block rounded-lg bg-mosque px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-mosque/90"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={close}
                className="block rounded-lg border border-white/20 px-4 py-2.5 text-center text-sm font-medium text-white/80 transition-colors hover:border-white hover:text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
