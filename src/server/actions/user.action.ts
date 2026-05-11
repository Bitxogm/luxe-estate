"use server";

import { z } from "zod";
import { auth } from "@/auth";
import * as repo from "@/server/repositories/user.repository";

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
