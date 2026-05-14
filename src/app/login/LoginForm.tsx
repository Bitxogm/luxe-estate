"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { notify } from "@/lib/toast";

const IS_DEV = process.env.NODE_ENV === "development";

const DEV_USERS = [
  { label: "Dev User", email: "dev@luxe.com", password: "Dev12345" }, // nosec
  { label: "Admin", email: "admin@luxe.com", password: "Admin12345" }, // nosec
] as const;

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  "block w-full rounded-lg border-none bg-clear-day px-4 py-3 text-sm text-nordic placeholder-nordic/30 outline-none ring-2 ring-transparent transition-all focus:ring-mosque dark:bg-white/5 dark:text-clear-day dark:placeholder-clear-day/30 dark:focus:ring-hint-green";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  function fillUser(email: string, password: string) {
    setValue("email", email);
    setValue("password", password);
  }

  async function onSubmit({ email, password }: FormValues) {
    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      setError("root", { message: "Invalid email or password." });
      return;
    }

    notify.success("Welcome back!");
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-nordic dark:bg-clear-day">
          <Building2 size={24} className="text-white dark:text-nordic" />
        </div>
        <div className="text-center">
          <h1 className="font-sf text-2xl font-semibold tracking-tight text-nordic dark:text-clear-day">
            Welcome to LuxeEstate
          </h1>
          <p className="mt-1 text-sm text-nordic/50 dark:text-clear-day/50">
            Sign in to access your account
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="overflow-hidden rounded-2xl border border-nordic/10 bg-white shadow-soft dark:border-white/10 dark:bg-nordic-muted/20">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-8">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-nordic dark:text-clear-day"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClass}
              {...register("email")}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-nordic dark:text-clear-day"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className={inputClass}
              {...register("password")}
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {errors.root && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
              {errors.root.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-mosque py-3 text-sm font-medium text-white shadow-md shadow-mosque/20 transition-all hover:-translate-y-0.5 hover:bg-mosque/90 hover:shadow-lg disabled:translate-y-0 disabled:opacity-60"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="border-t border-nordic/5 px-8 py-5 dark:border-white/5">
          <p className="text-center text-sm text-nordic/50 dark:text-clear-day/50">
            No account?{" "}
            <Link
              href="/register"
              className="font-medium text-mosque hover:underline dark:text-hint-green"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>

      {IS_DEV && (
        <div className="mt-4 rounded-xl border border-dashed border-nordic/10 p-4 dark:border-white/10">
          <p className="mb-2 text-center text-xs uppercase tracking-widest text-nordic/30 dark:text-clear-day/30">
            Dev shortcuts
          </p>
          <div className="flex gap-2">
            {DEV_USERS.map((u) => (
              <button
                key={u.email}
                type="button"
                onClick={() => fillUser(u.email, u.password)}
                className="flex-1 rounded-lg border border-nordic/10 px-3 py-2 text-xs text-nordic/50 transition-colors hover:border-mosque/40 hover:text-mosque dark:border-white/10 dark:text-clear-day/40 dark:hover:border-hint-green/40 dark:hover:text-hint-green"
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
