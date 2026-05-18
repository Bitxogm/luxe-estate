import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  findPropertiesByUser,
  getUserPropertyStats,
} from "@/server/repositories/property.repository";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/sections/Navbar";
import DeletePropertyButton from "@/components/dashboard/DeletePropertyButton";
import FeaturedButton from "@/components/dashboard/FeaturedButton";
import ProButton from "@/components/dashboard/ProButton";
import PaymentSuccessToast from "@/components/ui/PaymentSuccessToast";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  BedDouble,
  Bath,
  Ruler,
  Pencil,
  Building2,
  TrendingUp,
  Home,
  Crown,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Dashboard",
  description: "Manage your property listings on Luxe Estate",
};

const LIMIT = 8;

interface Props {
  searchParams: Promise<{ page?: string; featured?: string; pro?: string }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard");

  const { page, featured, pro } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const [{ properties, total }, stats, dbUser] = await Promise.all([
    findPropertiesByUser(session.user.id, currentPage, LIMIT),
    getUserPropertyStats(session.user.id),
    prisma.user.findUnique({ where: { id: session.user.id }, select: { isPro: true, name: true } }),
  ]);

  const isPro = dbUser?.isPro ?? false;

  const totalPages = Math.ceil(total / LIMIT);
  const from = total === 0 ? 0 : (currentPage - 1) * LIMIT + 1;
  const to = Math.min(currentPage * LIMIT, total);

  return (
    <>
      <Navbar />
      {featured === "success" && <PaymentSuccessToast message="Your listing is now featured!" />}
      {pro === "success" && (
        <PaymentSuccessToast message="Welcome to Pro! Your account has been upgraded." />
      )}
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-sf text-3xl font-bold tracking-tight text-nordic dark:text-clear-day">
                My Properties
              </h1>
              {isPro && (
                <span className="inline-flex items-center gap-1 rounded-full bg-nordic px-2.5 py-1 text-xs font-semibold text-white dark:bg-hint-green dark:text-nordic">
                  <Crown size={11} />
                  Pro
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-nordic/60 dark:text-clear-day/60">
              Manage your portfolio and track performance.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {!isPro && <ProButton />}
            <Link
              href="/properties/new"
              className="inline-flex items-center gap-2 rounded-lg bg-mosque px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-mosque/20 transition-all hover:-translate-y-0.5 hover:bg-mosque/90 hover:shadow-lg dark:bg-hint-green dark:text-nordic"
            >
              <Plus size={16} />
              Add New Property
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center justify-between rounded-xl border border-mosque/10 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-white/5">
            <div>
              <p className="text-sm font-medium text-nordic/50 dark:text-clear-day/50">
                Total Listings
              </p>
              <p className="mt-1 text-2xl font-bold text-nordic dark:text-clear-day">
                {stats.total}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mosque/10 text-mosque dark:bg-mosque/20 dark:text-hint-green">
              <Building2 size={20} />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-mosque/10 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-white/5">
            <div>
              <p className="text-sm font-medium text-nordic/50 dark:text-clear-day/50">For Sale</p>
              <p className="mt-1 text-2xl font-bold text-nordic dark:text-clear-day">
                {stats.forSale}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-hint-green text-mosque dark:bg-hint-green/20 dark:text-hint-green">
              <TrendingUp size={20} />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-mosque/10 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-white/5">
            <div>
              <p className="text-sm font-medium text-nordic/50 dark:text-clear-day/50">For Rent</p>
              <p className="mt-1 text-2xl font-bold text-nordic dark:text-clear-day">
                {stats.forRent}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-clear-day text-mosque dark:bg-white/10 dark:text-hint-green">
              <Home size={20} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-nordic/10 bg-white shadow-sm dark:border-white/5 dark:bg-white/5">
          {/* Table header — desktop only */}
          <div className="hidden grid-cols-12 gap-4 border-b border-nordic/5 bg-clear-day/60 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-nordic/50 dark:border-white/5 dark:bg-white/5 dark:text-clear-day/50 md:grid">
            <div className="col-span-6">Property Details</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {properties.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-hint-green">
                <Building2 size={28} className="text-mosque" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-nordic dark:text-clear-day">
                No properties yet
              </h3>
              <p className="mb-6 text-sm text-nordic/50 dark:text-clear-day/50">
                Start building your portfolio.
              </p>
              <Link
                href="/properties/new"
                className="rounded-lg bg-mosque px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-nordic dark:bg-hint-green dark:text-nordic"
              >
                Add your first property
              </Link>
            </div>
          ) : (
            properties.map((property, idx) => {
              const isLast = idx === properties.length - 1;
              const formattedPrice =
                property.priceType === "rent"
                  ? `${property.price.toLocaleString("es-ES")}€/mo`
                  : new Intl.NumberFormat("es-ES", {
                      style: "currency",
                      currency: "EUR",
                      maximumFractionDigits: 0,
                    }).format(property.price);

              return (
                <div
                  key={property.id}
                  className={`group grid grid-cols-1 items-center gap-4 px-6 py-5 transition-colors hover:bg-clear-day/50 dark:hover:bg-white/5 md:grid-cols-12 ${
                    !isLast ? "border-b border-nordic/5 dark:border-white/5" : ""
                  }`}
                >
                  {/* Property details */}
                  <div className="col-span-12 flex items-center gap-4 md:col-span-6">
                    <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={property.imageUrl}
                        alt={property.imageAlt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="112px"
                      />
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/properties/${property.slug}`}
                        className="block truncate text-base font-bold text-nordic transition-colors group-hover:text-mosque dark:text-clear-day dark:group-hover:text-hint-green"
                      >
                        {property.title}
                      </Link>
                      <p className="mt-0.5 truncate text-sm text-nordic/50 dark:text-clear-day/50">
                        {property.address}
                      </p>
                      <div className="mt-1.5 flex items-center gap-3 text-xs text-nordic/40 dark:text-clear-day/40">
                        <span className="flex items-center gap-1">
                          <BedDouble size={13} /> {property.beds}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-nordic/20" />
                        <span className="flex items-center gap-1">
                          <Bath size={13} /> {property.baths}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-nordic/20" />
                        <span className="flex items-center gap-1">
                          <Ruler size={13} /> {property.sqm} m²
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-6 md:col-span-2">
                    <p className="font-semibold text-nordic dark:text-clear-day">
                      {formattedPrice}
                    </p>
                    <p className="text-xs text-nordic/40 dark:text-clear-day/40">{property.type}</p>
                  </div>

                  {/* Status */}
                  <div className="col-span-6 md:col-span-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                        property.priceType === "sale"
                          ? "border border-mosque/10 bg-hint-green text-mosque dark:bg-hint-green/20 dark:text-hint-green"
                          : "border border-mosque/10 bg-mosque/5 text-mosque dark:bg-mosque/10 dark:text-hint-green"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          property.priceType === "sale" ? "bg-mosque" : "bg-mosque/60"
                        }`}
                      />
                      {property.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-12 flex flex-wrap items-center justify-end gap-2 md:col-span-2">
                    <FeaturedButton propertyId={property.id} isFeatured={property.isFeatured} />
                    <Link
                      href={`/properties/${property.slug}/edit`}
                      title="Edit property"
                      className="rounded-lg p-2 text-nordic/40 transition-colors hover:bg-hint-green/30 hover:text-mosque dark:text-clear-day/40 dark:hover:text-hint-green"
                    >
                      <Pencil size={16} />
                    </Link>
                    <DeletePropertyButton propertyId={property.id} propertyTitle={property.title} />
                  </div>
                </div>
              );
            })
          )}

          {/* Pagination footer */}
          {total > 0 && (
            <div className="flex items-center justify-between border-t border-nordic/5 bg-clear-day/30 px-6 py-4 dark:border-white/5 dark:bg-white/5">
              <p className="text-sm text-nordic/50 dark:text-clear-day/50">
                Showing <span className="font-medium text-nordic dark:text-clear-day">{from}</span>
                {" to "}
                <span className="font-medium text-nordic dark:text-clear-day">{to}</span>
                {" of "}
                <span className="font-medium text-nordic dark:text-clear-day">{total}</span> results
              </p>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard?page=${currentPage - 1}`}
                  aria-disabled={currentPage === 1}
                  className={`rounded-lg border border-nordic/10 px-3 py-1.5 text-sm text-nordic transition-colors hover:bg-white dark:border-white/10 dark:text-clear-day dark:hover:bg-white/5 ${
                    currentPage === 1 ? "pointer-events-none opacity-40" : ""
                  }`}
                >
                  Previous
                </Link>
                <Link
                  href={`/dashboard?page=${currentPage + 1}`}
                  aria-disabled={currentPage >= totalPages}
                  className={`rounded-lg border border-nordic/10 px-3 py-1.5 text-sm text-nordic transition-colors hover:bg-white dark:border-white/10 dark:text-clear-day dark:hover:bg-white/5 ${
                    currentPage >= totalPages ? "pointer-events-none opacity-40" : ""
                  }`}
                >
                  Next
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
