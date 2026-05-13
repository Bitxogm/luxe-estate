"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import * as repo from "@/server/repositories/user.repository";
import { prisma } from "@/lib/prisma";

const nameSchema = z.string().min(2, "Name must be at least 2 characters").max(100);

export async function updateUserName(
  rawName: string
): Promise<{ success: true; name: string } | { success: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthenticated" };

  const result = nameSchema.safeParse(rawName);
  if (!result.success) return { success: false, error: result.error.errors[0].message };

  const user = await repo.updateUserName(session.user.id, result.data);
  return { success: true, name: user.name ?? "" };
}

export async function updateUserAvatarAction(
  imageUrl: string
): Promise<{ success: true; image: string } | { success: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthenticated" };

  if (!imageUrl.startsWith("https://")) return { success: false, error: "Invalid image URL" };

  const user = await repo.updateUserImage(session.user.id, imageUrl);
  revalidatePath("/profile");
  revalidatePath("/", "layout");
  return { success: true, image: user.image ?? "" };
}

const VALID_ROLES = ["user", "admin"] as const;

export async function changeUserRoleAction(
  userId: string,
  role: string
): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  if (session.user.role !== "admin") return { error: "Unauthorized" };
  if (!VALID_ROLES.includes(role as (typeof VALID_ROLES)[number])) {
    return { error: "Invalid role" };
  }
  if (userId === session.user.id) return { error: "Cannot change your own role" };

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
  return {};
}
