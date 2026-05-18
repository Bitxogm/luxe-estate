"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function createNotificationAction(
  userId: string,
  type: string,
  title: string,
  body: string,
  href: string
) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        href,
      },
    });
    return { notification };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { error: "Failed to create notification" };
  }
}

export async function markAsReadAction(notificationId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      select: { userId: true },
    });

    if (!notification) {
      return { error: "Notification not found" };
    }

    if (notification.userId !== session.user.id) {
      return { error: "Forbidden" };
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    revalidatePath("/notifications");
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { error: "Failed to mark notification as read" };
  }
}

export async function markAllAsReadAction() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        read: false,
      },
      data: { read: true },
    });

    revalidatePath("/notifications");
    return { success: true };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return { error: "Failed to mark all notifications as read" };
  }
}

export async function deleteNotificationAction(notificationId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      select: { userId: true },
    });

    if (!notification) {
      return { error: "Notification not found" };
    }

    if (notification.userId !== session.user.id) {
      return { error: "Forbidden" };
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    revalidatePath("/notifications");
    return { success: true };
  } catch (error) {
    console.error("Error deleting notification:", error);
    return { error: "Failed to delete notification" };
  }
}
