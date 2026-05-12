import "server-only";
import { prisma } from "@/lib/prisma";

export async function findAllUsers(params: {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}) {
  const { page = 1, limit = 10, role, search } = params;
  const skip = (page - 1) * limit;

  const where = {
    ...(role && { role }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        _count: { select: { properties: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
}

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
