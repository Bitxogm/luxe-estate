"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notify } from "@/lib/toast";

const IS_DEV = process.env.NODE_ENV === "development";

const DEV_USERS = [
  { label: "Dev User", email: "dev@luxe.com", password: "Dev12345" },
  { label: "Admin", email: "admin@luxe.com", password: "Admin12345" },
] as const;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function fillUser(email: string, password: string) {
    setEmail(email);
    setPassword(password);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      notify.error("Invalid email or password.");
      return;
    }

    notify.success("Welcome back!");
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="font-sf text-2xl font-light text-nordic dark:text-clear-day">
          Sign in
        </CardTitle>
        <CardDescription className="text-nordic-muted dark:text-clear-day/60">
          Access your Luxe Estate account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full bg-mosque hover:bg-mosque/90" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        {IS_DEV && (
          <div className="mt-5 border-t border-dashed border-nordic/10 pt-4 dark:border-white/10">
            <p className="mb-2 text-center text-xs uppercase tracking-widest text-nordic-muted dark:text-clear-day/40">
              Dev shortcuts
            </p>
            <div className="flex gap-2">
              {DEV_USERS.map((u) => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => fillUser(u.email, u.password)}
                  className="flex-1 rounded-lg border border-nordic/10 px-3 py-2 text-xs text-nordic-muted transition-colors hover:border-mosque/40 hover:text-mosque dark:border-white/10 dark:text-clear-day/40 dark:hover:border-hint-green/40 dark:hover:text-hint-green"
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>
        )}
        <p className="mt-4 text-center text-sm text-nordic-muted dark:text-clear-day/60">
          No account?{" "}
          <Link href="/register" className="text-mosque hover:underline dark:text-hint-green">
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
