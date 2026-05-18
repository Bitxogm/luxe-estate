"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { createNotificationAction } from "./notification.action";

type SendMessageResult = { conversationId: string } | { error: string };

export async function sendMessageAction(
  propertyId: string,
  content: string
): Promise<SendMessageResult> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const buyerId = session.user.id;

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { userId: true, title: true },
  });

  if (!property?.userId) return { error: "Property not found" };

  const ownerId = property.userId;

  if (buyerId === ownerId) return { error: "No puedes enviarte mensajes a ti mismo" };

  const conversation = await prisma.conversation.upsert({
    where: { propertyId_buyerId: { propertyId, buyerId } },
    create: { propertyId, buyerId, ownerId },
    update: {},
  });

  if (!content.trim()) return { conversationId: conversation.id };

  const message = await prisma.message.create({
    data: { conversationId: conversation.id, senderId: buyerId, content: content.trim() },
    include: { sender: { select: { id: true, name: true } } },
  });

  await pusherServer.trigger(`conversation-${conversation.id}`, "new-message", {
    id: message.id,
    content: message.content,
    senderId: message.senderId,
    senderName: message.sender.name ?? "User",
    createdAt: message.createdAt.toISOString(),
  });

  // Trigger notification to the conversation receiver (owner)
  const senderName = message.sender.name || "A user";
  const propertyTitle = property.title;
  await createNotificationAction(
    ownerId,
    "message",
    "New message",
    `${senderName} sent you a message about ${propertyTitle}`,
    `/messages/${conversation.id}`
  );

  revalidatePath("/messages");

  return { conversationId: conversation.id };
}
