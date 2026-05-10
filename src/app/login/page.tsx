import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import LoginForm from "./LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in — Luxe Estate",
};

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className="flex min-h-screen items-center justify-center bg-clear-day px-4 dark:bg-nordic">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
