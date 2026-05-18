"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Uncaught application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-clear-day px-4 dark:bg-nordic">
      {/* 500 */}
      <p className="select-none font-sf text-[10rem] font-bold leading-none tracking-tight text-mosque/15 dark:text-hint-green/10 sm:text-[14rem]">
        500
      </p>

      {/* Text */}
      <div className="-mt-6 mb-10 text-center sm:-mt-10">
        <h1 className="font-sf text-3xl font-semibold tracking-tight text-nordic dark:text-clear-day sm:text-4xl">
          Something went wrong
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-nordic/50 dark:text-clear-day/50">
          An unexpected error occurred. Please try again.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Button
          onClick={() => reset()}
          className="bg-mosque px-8 py-2.5 text-sm font-medium text-white shadow-md shadow-mosque/20 transition-all hover:-translate-y-0.5 hover:bg-mosque/90 hover:shadow-lg dark:bg-hint-green dark:text-nordic"
        >
          Try again
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-nordic/20 px-8 py-2.5 text-sm font-medium text-nordic transition-colors hover:bg-nordic/5 dark:border-clear-day/20 dark:text-clear-day dark:hover:bg-white/5"
        >
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
