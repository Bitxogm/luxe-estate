import "server-only";
import { prisma } from "@/lib/prisma";

export async function getNotificationsByUserId(userId: string) {
  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    }),
  ]);

  return {
    notifications,
    unreadCount,
  };
}
