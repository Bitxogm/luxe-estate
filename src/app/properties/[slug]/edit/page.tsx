import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getPropertyBySlug } from "@/server/services/property.service";
import Navbar from "@/components/sections/Navbar";
import NewPropertyForm from "@/components/properties/NewPropertyForm";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { ZodError } from "zod";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug).catch(() => null);
  return {
    title: property ? `Edit · ${property.title} — Luxe Estate` : "Edit Property — Luxe Estate",
  };
}

export default async function EditPropertyPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) {
    const { slug } = await params;
    redirect(`/login?callbackUrl=/properties/${slug}/edit`);
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

  const isOwner = session.user.id === property.userId || session.user.role === "admin";
  if (!isOwner) redirect(`/properties/${property.slug}`);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col justify-between gap-6 border-b border-nordic/10 pb-8 dark:border-white/10 md:flex-row md:items-end">
          <div className="space-y-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-1 text-sm text-nordic/50 dark:text-clear-day/50">
                <li>
                  <Link
                    href="/"
                    className="transition-colors hover:text-mosque dark:hover:text-hint-green"
                  >
                    Properties
                  </Link>
                </li>
                <li>
                  <ChevronRight size={14} />
                </li>
                <li>
                  <Link
                    href={`/properties/${property.slug}`}
                    className="transition-colors hover:text-mosque dark:hover:text-hint-green"
                  >
                    {property.title}
                  </Link>
                </li>
                <li>
                  <ChevronRight size={14} />
                </li>
                <li className="text-nordic dark:text-clear-day">Edit</li>
              </ol>
            </nav>
            <div>
              <h1 className="font-sf text-3xl font-bold tracking-tight text-nordic dark:text-clear-day md:text-4xl">
                Edit Property
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-nordic/60 dark:text-clear-day/60">
                Update the listing details below. Fields marked with{" "}
                <span className="text-red-500">*</span> are mandatory.
              </p>
            </div>
          </div>

          <div className="hidden gap-3 md:flex">
            <Link
              href={`/properties/${property.slug}`}
              className="rounded-lg border border-nordic/20 bg-white px-5 py-2.5 text-sm font-medium text-nordic transition-colors hover:bg-nordic/5 dark:border-white/10 dark:bg-transparent dark:text-clear-day dark:hover:bg-white/5"
            >
              Cancel
            </Link>
            <button
              type="submit"
              form="new-property-form"
              className="flex items-center gap-2 rounded-lg bg-mosque px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-nordic hover:shadow-lg dark:bg-hint-green dark:text-nordic"
            >
              Save Changes
            </button>
          </div>
        </header>

        <NewPropertyForm property={property} />
      </main>
    </>
  );
}
