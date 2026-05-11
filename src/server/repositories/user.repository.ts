import "server-only";
import { prisma } from "@/lib/prisma";

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: { select: { savedProperties: true } },
    },
  });
}

export async function updateUserName(id: string, name: string) {
  return prisma.user.update({
    where: { id },
    data: { name },
    select: { id: true, name: true, email: true },
  });
}
