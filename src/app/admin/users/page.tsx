import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { findAllUsers } from "@/server/repositories/user.repository";
import Navbar from "@/components/sections/Navbar";
import ChangeRoleButton from "@/components/admin/ChangeRoleButton";
import UserSearchInput from "@/components/admin/UserSearchInput";
import Link from "next/link";
import Image from "next/image";
import { Shield, User, Building2 } from "lucide-react";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "User Directory — Luxe Estate Admin" };

const LIMIT = 10;

const TABS = [
  { label: "All Users", role: "" },
  { label: "Users", role: "user" },
  { label: "Admins", role: "admin" },
] as const;

interface Props {
  searchParams: Promise<{ page?: string; role?: string; q?: string }>;
}

function getInitials(name?: string | null, email?: string | null) {
  if (name)
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  return (email?.[0] ?? "U").toUpperCase();
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/admin/users");
  if (session.user.role !== "admin") redirect("/");

  const { page, role, q } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const activeRole = role ?? "";
  const search = q ?? "";

  const { users, total } = await findAllUsers({
    page: currentPage,
    limit: LIMIT,
    role: activeRole || undefined,
    search: search || undefined,
  });

  const totalPages = Math.ceil(total / LIMIT);
  const from = total === 0 ? 0 : (currentPage - 1) * LIMIT + 1;
  const to = Math.min(currentPage * LIMIT, total);

  function buildUrl(params: Record<string, string>) {
    const p = new URLSearchParams();
    if (activeRole) p.set("role", activeRole);
    if (search) p.set("q", search);
    p.set("page", "1");
    Object.entries(params).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    return `/admin/users?${p.toString()}`;
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="font-sf text-3xl font-bold tracking-tight text-nordic dark:text-clear-day">
              User Directory
            </h1>
            <p className="mt-1 text-sm text-nordic/60 dark:text-clear-day/60">
              Manage user access and roles.
            </p>
          </div>
          <Suspense fallback={null}>
            <UserSearchInput defaultValue={search} />
          </Suspense>
        </div>

        {/* Role tabs */}
        <div className="mb-8 flex gap-6 overflow-x-auto border-b border-nordic/10 dark:border-white/10">
          {TABS.map((tab) => (
            <Link
              key={tab.role}
              href={buildUrl({ role: tab.role })}
              className={`whitespace-nowrap border-b-2 pb-3 text-sm font-medium transition-colors ${
                activeRole === tab.role
                  ? "border-mosque text-mosque dark:border-hint-green dark:text-hint-green"
                  : "border-transparent text-nordic/50 hover:text-nordic dark:text-clear-day/50 dark:hover:text-clear-day"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Table */}
        <div className="space-y-3">
          {/* Column headers — desktop only */}
          <div className="hidden grid-cols-12 gap-4 px-5 text-xs font-semibold uppercase tracking-wider text-nordic/40 dark:text-clear-day/40 md:grid">
            <div className="col-span-4">User Details</div>
            <div className="col-span-3">Role</div>
            <div className="col-span-3">Properties</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {users.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-nordic/5 bg-white py-20 text-center dark:border-white/5 dark:bg-white/5">
              <User size={40} className="mb-4 text-nordic/20 dark:text-clear-day/20" />
              <p className="text-nordic/50 dark:text-clear-day/50">No users found.</p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="group flex flex-col items-center gap-4 rounded-xl border border-nordic/5 bg-white p-5 transition-all hover:border-mosque/10 hover:bg-hint-green/20 hover:shadow-sm dark:border-white/5 dark:bg-white/5 dark:hover:bg-hint-green/5 md:grid md:grid-cols-12"
              >
                {/* User details */}
                <div className="col-span-4 flex w-full items-center gap-4">
                  <div className="relative flex-shrink-0">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name ?? user.email}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mosque text-sm font-bold text-white dark:bg-hint-green dark:text-nordic">
                        {getInitials(user.name, user.email)}
                      </div>
                    )}
                    {user.role === "admin" && (
                      <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-nordic ring-2 ring-white dark:ring-nordic">
                        <Shield size={9} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-nordic dark:text-clear-day">
                      {user.name ?? "—"}
                    </p>
                    <p className="truncate text-xs text-nordic/60 dark:text-clear-day/60">
                      {user.email}
                    </p>
                    <p className="mt-1 text-[10px] text-nordic/40 dark:text-clear-day/40">
                      Since {new Date(user.createdAt).getFullYear()}
                    </p>
                  </div>
                </div>

                {/* Role */}
                <div className="col-span-3 w-full">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-nordic text-white dark:bg-white dark:text-nordic"
                        : "bg-nordic/5 text-nordic/70 dark:bg-white/10 dark:text-clear-day/70"
                    }`}
                  >
                    {user.role === "admin" ? <Shield size={11} /> : <User size={11} />}
                    {user.role === "admin" ? "Admin" : "User"}
                  </span>
                </div>

                {/* Properties count */}
                <div className="col-span-3 w-full">
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 size={14} className="text-mosque/60 dark:text-hint-green/60" />
                    <span className="font-semibold text-nordic dark:text-clear-day">
                      {user._count.properties}
                    </span>
                    <span className="text-xs text-nordic/40 dark:text-clear-day/40">
                      {user._count.properties === 1 ? "listing" : "listings"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-2 w-full">
                  {user.id === session.user.id ? (
                    <p className="text-right text-xs text-nordic/30 dark:text-clear-day/30">You</p>
                  ) : (
                    <ChangeRoleButton
                      userId={user.id}
                      currentRole={user.role}
                      userName={user.name ?? user.email}
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {total > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-nordic/50 dark:text-clear-day/50">
              Showing <span className="font-medium text-nordic dark:text-clear-day">{from}</span>
              {" to "}
              <span className="font-medium text-nordic dark:text-clear-day">{to}</span>
              {" of "}
              <span className="font-medium text-nordic dark:text-clear-day">{total}</span> users
            </p>
            <div className="flex gap-2">
              <Link
                href={`/admin/users?${new URLSearchParams({ ...(activeRole && { role: activeRole }), ...(search && { q: search }), page: String(currentPage - 1) })}`}
                aria-disabled={currentPage === 1}
                className={`rounded-lg border border-nordic/10 px-3 py-1.5 text-sm text-nordic transition-colors hover:bg-white dark:border-white/10 dark:text-clear-day dark:hover:bg-white/5 ${currentPage === 1 ? "pointer-events-none opacity-40" : ""}`}
              >
                Previous
              </Link>
              <Link
                href={`/admin/users?${new URLSearchParams({ ...(activeRole && { role: activeRole }), ...(search && { q: search }), page: String(currentPage + 1) })}`}
                aria-disabled={currentPage >= totalPages}
                className={`rounded-lg border border-nordic/10 px-3 py-1.5 text-sm text-nordic transition-colors hover:bg-white dark:border-white/10 dark:text-clear-day dark:hover:bg-white/5 ${currentPage >= totalPages ? "pointer-events-none opacity-40" : ""}`}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
