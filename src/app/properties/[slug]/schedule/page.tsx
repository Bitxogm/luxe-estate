import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getPropertyBySlug } from "@/server/services/property.service";
import Navbar from "@/components/sections/Navbar";
import ScheduleVisitForm from "@/components/properties/ScheduleVisitForm";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, BedDouble, Bath, Ruler } from "lucide-react";
import type { Metadata } from "next";
import { ZodError } from "zod";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug).catch(() => null);
  if (!property) return { title: "Schedule Visit — Luxe Estate" };
  return { title: `Schedule Visit · ${property.title} — Luxe Estate` };
}

export default async function SchedulePage({ params }: Props) {
  const session = await auth();
  if (!session?.user) {
    const { slug } = await params;
    redirect(`/login?callbackUrl=/properties/${slug}/schedule`);
  }

  let property;
  try {
    const { slug } = await params;
    property = await getPropertyBySlug(slug);
  } catch (e) {
    if (e instanceof ZodError) notFound();
    throw e;
  }
  if (!property) notFound();

  const formattedPrice =
    property.priceType === "rent"
      ? `$${property.price.toLocaleString("en-US")}/mo`
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(property.price);

  return (
    <>
      <Navbar />
      <main className="mx-auto flex max-w-7xl flex-col items-center px-4 py-8 pt-28 sm:px-6 lg:px-8">
        <div className="mb-6 w-full">
          <Link
            href={`/properties/${property.slug}`}
            className="group flex w-fit items-center gap-2 text-sm text-nordic/60 transition-colors hover:text-mosque dark:text-clear-day/60 dark:hover:text-hint-green"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            Back to property details
          </Link>
        </div>

        <div className="w-full overflow-hidden rounded-xl border border-slate-100 bg-white shadow-2xl shadow-mosque/5 dark:border-white/5 dark:bg-nordic md:flex">
          {/* Left — property info */}
          <div className="relative flex w-full flex-col gap-6 bg-slate-50 p-6 dark:bg-white/5 md:w-5/12 md:p-8 lg:p-10">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-md">
              <Image
                src={property.imageUrl}
                alt={property.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-mosque backdrop-blur-sm dark:bg-nordic/80">
                {property.status}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold leading-tight text-nordic dark:text-clear-day">
                  {property.title}
                </h2>
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-clear-day/60">
                  <MapPin size={14} /> {property.address}
                </p>
              </div>

              <div className="flex items-center justify-between border-y border-slate-200 py-4 dark:border-white/10">
                <div className="flex flex-col">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Price
                  </span>
                  <span className="text-xl font-bold text-mosque dark:text-hint-green">
                    {formattedPrice}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-slate-600 dark:text-clear-day/70">
                  <div className="flex flex-col items-center">
                    <BedDouble size={18} className="text-slate-400" />
                    <span className="text-xs font-medium">{property.beds} Beds</span>
                  </div>
                  <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />
                  <div className="flex flex-col items-center">
                    <Bath size={18} className="text-slate-400" />
                    <span className="text-xs font-medium">{property.baths} Baths</span>
                  </div>
                  <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />
                  <div className="flex flex-col items-center">
                    <Ruler size={18} className="text-slate-400" />
                    <span className="text-xs font-medium">{property.sqm} m²</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="w-full p-6 md:w-7/12 md:p-8 lg:p-10">
            <ScheduleVisitForm propertyId={property.id} propertySlug={property.slug} />
          </div>
        </div>
      </main>
    </>
  );
}
