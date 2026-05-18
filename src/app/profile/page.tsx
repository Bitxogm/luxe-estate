import { auth } from "@/auth";
import { redirect } from "next/navigation";
import * as userRepo from "@/server/repositories/user.repository";
import { findSavedProperties } from "@/server/repositories/property.repository";
import { findVisitsByUser } from "@/server/repositories/visit.repository";
import Navbar from "@/components/sections/Navbar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import PaymentSuccessToast from "@/components/ui/PaymentSuccessToast";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile",
};

interface Props {
  searchParams: Promise<{ tab?: string; deposit?: string }>;
}

const VALID_TABS = ["saved", "visits", "settings"] as const;
type ValidTab = (typeof VALID_TABS)[number];

export default async function ProfilePage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/profile");

  const { tab, deposit } = await searchParams;
  const defaultTab: ValidTab = VALID_TABS.includes(tab as ValidTab) ? (tab as ValidTab) : "saved";

  const [user, savedProperties, visits] = await Promise.all([
    userRepo.findUserById(session.user.id),
    findSavedProperties(session.user.id),
    findVisitsByUser(session.user.id),
  ]);

  if (!user) redirect("/login");

  return (
    <>
      <Navbar />
      {deposit === "success" && (
        <PaymentSuccessToast message="Visit confirmed! Your deposit has been received." />
      )}
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <ProfileHeader
          name={user.name ?? ""}
          email={user.email}
          image={user.image}
          createdAt={user.createdAt}
          savedCount={user._count.savedProperties}
          visitCount={visits.length}
        />
        <ProfileTabs
          savedProperties={savedProperties}
          visits={visits}
          name={user.name ?? ""}
          email={user.email}
          image={user.image}
          defaultTab={defaultTab}
        />
      </main>
    </>
  );
}
