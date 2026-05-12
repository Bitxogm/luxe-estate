import { auth } from "@/auth";
import { redirect } from "next/navigation";
import * as userRepo from "@/server/repositories/user.repository";
import { findSavedProperties } from "@/server/repositories/property.repository";
import { findVisitsByUser } from "@/server/repositories/visit.repository";
import Navbar from "@/components/sections/Navbar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile — Luxe Estate",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/profile");

  const [user, savedProperties, visits] = await Promise.all([
    userRepo.findUserById(session.user.id),
    findSavedProperties(session.user.id),
    findVisitsByUser(session.user.id),
  ]);

  if (!user) redirect("/login");

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <ProfileHeader
          name={user.name ?? ""}
          email={user.email}
          createdAt={user.createdAt}
          savedCount={user._count.savedProperties}
          visitCount={visits.length}
        />
        <ProfileTabs
          savedProperties={savedProperties}
          visits={visits}
          name={user.name ?? ""}
          email={user.email}
        />
      </main>
    </>
  );
}
