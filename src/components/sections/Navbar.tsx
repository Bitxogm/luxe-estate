import { Building2, Search, Bell } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { auth } from "@/auth";
import NavbarUserMenu from "./NavbarUserMenu";

export default async function Navbar() {
  const session = await auth();
  return (
    <nav className="sticky top-0 z-50 border-b border-nordic/10 bg-clear-day/95 backdrop-blur-md transition-colors duration-300 dark:border-clear-day/10 dark:bg-nordic/95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-shrink-0 cursor-pointer items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-nordic transition-colors dark:bg-clear-day">
              <Building2 size={18} className="text-white dark:text-nordic" />
            </div>
            <span className="font-sf text-xl font-semibold tracking-tight text-nordic transition-colors dark:text-white">
              LuxeEstate
            </span>
          </div>

          <div className="hidden items-center space-x-8 md:flex">
            <Link
              href="/?priceType=sale"
              className="px-1 py-1 text-sm font-medium text-nordic/70 transition-all hover:border-b-2 hover:border-nordic/20 hover:text-nordic dark:text-clear-day/70 dark:hover:border-clear-day/20 dark:hover:text-clear-day"
            >
              Buy
            </Link>
            <Link
              href="/?priceType=rent"
              className="px-1 py-1 text-sm font-medium text-nordic/70 transition-all hover:border-b-2 hover:border-nordic/20 hover:text-nordic dark:text-clear-day/70 dark:hover:border-clear-day/20 dark:hover:text-clear-day"
            >
              Rent
            </Link>
            <Link
              href="/properties/new"
              className="px-1 py-1 text-sm font-medium text-nordic/70 transition-all hover:border-b-2 hover:border-nordic/20 hover:text-nordic dark:text-clear-day/70 dark:hover:border-clear-day/20 dark:hover:text-clear-day"
            >
              Sell
            </Link>
            <Link
              href="/favorites"
              className="px-1 py-1 text-sm font-medium text-nordic/70 transition-all hover:border-b-2 hover:border-nordic/20 hover:text-nordic dark:text-clear-day/70 dark:hover:border-clear-day/20 dark:hover:text-clear-day"
            >
              Saved Homes
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <button className="text-nordic transition-colors hover:text-mosque dark:text-clear-day dark:hover:text-hint-green">
              <Search size={20} />
            </button>
            <button className="relative text-nordic transition-colors hover:text-mosque dark:text-clear-day dark:hover:text-hint-green">
              <Bell size={20} />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-clear-day bg-red-500 transition-colors dark:border-nordic" />
            </button>
            <ThemeToggle />
            <div className="ml-2 border-l border-nordic/10 pl-4 dark:border-clear-day/10">
              {session?.user ? (
                <NavbarUserMenu
                  name={session.user.name}
                  email={session.user.email}
                  role={session.user.role}
                />
              ) : (
                <Link
                  href="/login"
                  className="rounded-lg bg-mosque px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-mosque/90"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
