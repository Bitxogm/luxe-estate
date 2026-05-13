"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Building2, Camera, Loader2 } from "lucide-react";
import { notify } from "@/lib/toast";
import { registerUser } from "@/server/actions/auth.action";
import { uploadAvatarAction } from "@/server/actions/upload.action";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadAvatarAction(formData);
    setIsUploadingAvatar(false);

    if ("error" in result) {
      notify.error(result.error);
    } else {
      setAvatarUrl(result.url);
    }
  }

  async function handleSubmit(e: React.BaseSyntheticEvent) {
    e.preventDefault();
    setLoading(true);

    const result = await registerUser({
      name,
      email,
      password,
      image: avatarUrl || undefined,
    });

    if (result.error) {
      notify.error(result.error);
      setLoading(false);
      return;
    }

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (signInResult?.error) {
      notify.error("Account created but could not sign in. Please log in manually.");
      router.push("/login");
      return;
    }

    notify.success("Account created. Welcome to Luxe Estate!");
    router.push("/");
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
            Join LuxeEstate
          </h1>
          <p className="mt-1 text-sm text-nordic/50 dark:text-clear-day/50">
            Save and list premium properties
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="overflow-hidden rounded-2xl border border-nordic/10 bg-white shadow-soft dark:border-white/10 dark:bg-nordic-muted/20">
        <form onSubmit={handleSubmit} className="space-y-5 p-8">
          {/* Avatar picker */}
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="relative h-20 w-20 flex-shrink-0 focus:outline-none"
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Avatar preview"
                  fill
                  className="rounded-full border-4 border-hint-green object-cover shadow-md"
                  sizes="80px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-dashed border-nordic/20 bg-clear-day text-lg font-bold text-nordic/40 transition-colors hover:border-mosque hover:bg-hint-green/20 dark:border-white/20 dark:bg-white/5 dark:hover:border-hint-green">
                  {name ? getInitials(name) : <Camera size={22} />}
                </div>
              )}
              {isUploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-nordic/40">
                  <Loader2 size={20} className="animate-spin text-white" />
                </div>
              )}
            </button>
            <p className="text-xs text-nordic/40 dark:text-clear-day/40">
              {avatarUrl ? "Photo added" : "Add profile photo (optional)"}
            </p>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-nordic dark:text-clear-day"
            >
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="block w-full rounded-lg border-none bg-clear-day px-4 py-3 text-sm text-nordic placeholder-nordic/30 outline-none ring-2 ring-transparent transition-all focus:ring-mosque dark:bg-white/5 dark:text-clear-day dark:placeholder-clear-day/30 dark:focus:ring-hint-green"
            />
          </div>

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
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="block w-full rounded-lg border-none bg-clear-day px-4 py-3 text-sm text-nordic placeholder-nordic/30 outline-none ring-2 ring-transparent transition-all focus:ring-mosque dark:bg-white/5 dark:text-clear-day dark:placeholder-clear-day/30 dark:focus:ring-hint-green"
            />
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
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              className="block w-full rounded-lg border-none bg-clear-day px-4 py-3 text-sm text-nordic placeholder-nordic/30 outline-none ring-2 ring-transparent transition-all focus:ring-mosque dark:bg-white/5 dark:text-clear-day dark:placeholder-clear-day/30 dark:focus:ring-hint-green"
            />
          </div>

          <button
            type="submit"
            disabled={loading || isUploadingAvatar}
            className="w-full rounded-lg bg-mosque py-3 text-sm font-medium text-white shadow-md shadow-mosque/20 transition-all hover:-translate-y-0.5 hover:bg-mosque/90 hover:shadow-lg disabled:translate-y-0 disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div className="border-t border-nordic/5 px-8 py-5 dark:border-white/5">
          <p className="text-center text-sm text-nordic/50 dark:text-clear-day/50">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-mosque hover:underline dark:text-hint-green"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
