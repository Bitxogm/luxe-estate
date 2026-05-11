"use server";

import { auth } from "@/auth";
import * as repo from "@/server/repositories/property.repository";

export async function toggleSaveProperty(
  propertyId: string
): Promise<{ saved: boolean } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "unauthenticated" };

  return repo.toggleSavedProperty(session.user.id, propertyId);
}

export async function getSavedProperties() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return repo.findSavedProperties(session.user.id);
}
