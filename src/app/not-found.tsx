import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-clear-day px-4 dark:bg-nordic">
      {/* 404 */}
      <p className="select-none font-sf text-[10rem] font-bold leading-none tracking-tight text-mosque/15 dark:text-hint-green/10 sm:text-[14rem]">
        404
      </p>

      {/* Text */}
      <div className="-mt-6 mb-10 text-center sm:-mt-10">
        <h1 className="font-sf text-3xl font-semibold tracking-tight text-nordic dark:text-clear-day sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-nordic/50 dark:text-clear-day/50">
          The property you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Button
          asChild
          className="bg-mosque px-8 py-2.5 text-sm font-medium text-white shadow-md shadow-mosque/20 transition-all hover:-translate-y-0.5 hover:bg-mosque/90 hover:shadow-lg dark:bg-hint-green dark:text-nordic"
        >
          <Link href="/">Back to Home</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-nordic/20 px-8 py-2.5 text-sm font-medium text-nordic transition-colors hover:bg-nordic/5 dark:border-clear-day/20 dark:text-clear-day dark:hover:bg-white/5"
        >
          <Link href="/?section=listings">Browse Properties</Link>
        </Button>
      </div>
    </div>
  );
}
