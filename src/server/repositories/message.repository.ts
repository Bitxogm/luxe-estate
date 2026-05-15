import "server-only";
import { prisma } from "@/lib/prisma";

export async function getConversationsByUserId(userId: string) {
  return prisma.conversation.findMany({
    where: { OR: [{ buyerId: userId }, { ownerId: userId }] },
    include: {
      property: { select: { title: true, imageUrl: true, slug: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { content: true, createdAt: true },
      },
      buyer: { select: { id: true, name: true, image: true } },
      owner: { select: { id: true, name: true, image: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getMessagesByConversationId(conversationId: string, userId: string) {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ buyerId: userId }, { ownerId: userId }],
    },
    select: { id: true, buyerId: true, ownerId: true, propertyId: true },
  });

  if (!conversation) return null;

  const messages = await prisma.message.findMany({
    where: { conversationId },
    include: { sender: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: "asc" },
  });

  return { conversation, messages };
}
