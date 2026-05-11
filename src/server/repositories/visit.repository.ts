import "server-only";
import { prisma } from "@/lib/prisma";

export async function createVisit(data: {
  userId: string;
  propertyId: string;
  scheduledAt: Date;
  message?: string;
}) {
  return prisma.visit.create({ data });
}

export async function findVisitsByUser(userId: string) {
  return prisma.visit.findMany({
    where: { userId },
    include: { property: true },
    orderBy: { scheduledAt: "asc" },
  });
}
