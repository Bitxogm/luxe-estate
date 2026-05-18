import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getNotificationsByUserId } from "@/server/repositories/notification.repository";
import Navbar from "@/components/sections/Navbar";
import NotificationsClient from "./NotificationsClient";

export const metadata: Metadata = {
  title: "Notifications",
};

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/notifications");
  }

  const { notifications, unreadCount } = await getNotificationsByUserId(session.user.id);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <NotificationsClient
          initialNotifications={notifications}
          initialUnreadCount={unreadCount}
        />
      </main>
    </>
  );
}
