import { Building2, Globe, Share2, Rss } from "lucide-react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/?priceType=sale", label: "Buy" },
  { href: "/?priceType=rent", label: "Rent" },
  { href: "/properties/new", label: "Sell" },
  { href: "/favorites", label: "Saved Homes" },
] as const;

const COMPANY_LINKS = [
  { href: "#", label: "About" },
  { href: "#", label: "Contact" },
  { href: "#", label: "Careers" },
] as const;

const LEGAL_LINKS = [
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Service" },
] as const;

const SOCIAL_ICONS = [
  { Icon: Globe, label: "Web" },
  { Icon: Share2, label: "Share" },
  { Icon: Rss, label: "RSS" },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-nordic">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* Col 1 — Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-clear-day">
                <Building2 className="h-4 w-4 text-nordic" />
              </div>
              <span className="font-sf text-lg font-semibold tracking-tight text-white">
                LuxeEstate
              </span>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-white/50">
              Find your perfect place. Curated premium properties for the discerning eye.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_ICONS.map(({ Icon, label }) => (
                <span
                  key={label}
                  aria-label={label}
                  className="flex h-8 w-8 cursor-default items-center justify-center rounded-full border border-white/10 text-white/40 transition-colors hover:border-white/30 hover:text-white/70"
                >
                  <Icon className="h-[15px] w-[15px]" />
                </span>
              ))}
            </div>
          </div>

          {/* Col 2 — Links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
              Browse
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Company */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
              Company
            </h3>
            <ul className="space-y-3">
              {COMPANY_LINKS.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Legal */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
              Legal
            </h3>
            <ul className="space-y-3">
              {LEGAL_LINKS.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-xs text-white/30">© 2026 Luxe Estate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
