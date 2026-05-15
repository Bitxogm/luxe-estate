import { Building2, Bell, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { auth } from "@/auth";
import NavbarUserMenu from "./NavbarUserMenu";
import NavbarSearch from "./NavbarSearch";
import MobileDrawer from "./MobileDrawer";

export default async function Navbar() {
  const session = await auth();
  const user = session?.user ?? null;

  return (
    <nav className="sticky top-0 z-50 bg-nordic">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left — logo */}
          <Link href="/" className="flex flex-shrink-0 items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
              <Building2 size={18} className="text-white" />
            </div>
            <span className="font-sf text-lg font-semibold tracking-tight text-white">
              LuxeEstate
            </span>
          </Link>

          {/* Center — nav links (desktop) */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/?priceType=sale"
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              Buy
            </Link>
            <Link
              href="/?priceType=rent"
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              Rent
            </Link>
            {user && (
              <Link
                href="/properties/new"
                className="text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                Sell
              </Link>
            )}
          </div>

          {/* Right — icons + auth */}
          <div className="flex items-center gap-5">
            {/* Search */}
            <NavbarSearch />

            {/* Bell — coming soon */}
            <div className="group relative hidden md:flex md:items-center">
              <button
                aria-label="Notifications"
                className="relative text-white/70 transition-colors hover:text-white"
              >
                <Bell size={19} />
                <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-hint-green" />
              </button>
              <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white/10 px-2 py-1 text-xs text-white/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                Coming soon
              </span>
            </div>

            {/* Messages */}
            {user && (
              <Link
                href="/messages"
                aria-label="Messages"
                className="hidden text-white/70 transition-colors hover:text-white md:block"
              >
                <MessageCircle size={19} />
              </Link>
            )}

            {/* Heart — favorites */}
            {user && (
              <Link
                href="/favorites"
                aria-label="Saved homes"
                className="hidden text-white/70 transition-colors hover:text-white md:block"
              >
                <Heart size={19} />
              </Link>
            )}

            <ThemeToggle />

            {/* Auth */}
            <div className="hidden items-center gap-2 border-l border-white/10 pl-4 md:flex">
              {user ? (
                <NavbarUserMenu
                  name={user.name}
                  email={user.email}
                  role={user.role}
                  image={user.image}
                />
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-lg bg-mosque px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-mosque/90"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-lg border border-white/20 px-4 py-1.5 text-sm font-medium text-white/80 transition-colors hover:border-white hover:text-white"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <MobileDrawer
              user={user ? { name: user.name, email: user.email, role: user.role } : null}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
