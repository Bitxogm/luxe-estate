import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RegisterForm from "./RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
};

export default async function RegisterPage() {
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className="flex min-h-screen items-center justify-center bg-clear-day px-4 dark:bg-nordic">
      <RegisterForm />
    </div>
  );
}
