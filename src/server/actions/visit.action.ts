"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import * as repo from "@/server/repositories/visit.repository";

const scheduleSchema = z.object({
  propertyId: z.string().min(1),
  propertySlug: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time"),
  message: z.string().max(1000).optional(),
});

export async function scheduleVisit(
  _prev: unknown,
  formData: FormData
): Promise<{ errors: Record<string, string> }> {
  const session = await auth();
  if (!session?.user?.id) {
    const slug = formData.get("propertySlug") as string;
    redirect(`/login?callbackUrl=/properties/${slug}/schedule`);
  }

  const raw = Object.fromEntries(formData.entries());
  const result = scheduleSchema.safeParse(raw);

  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.errors.forEach((e) => {
      if (e.path[0]) errors[String(e.path[0])] = e.message;
    });
    return { errors };
  }

  const { propertyId, propertySlug, date, time, message } = result.data;
  const scheduledAt = new Date(`${date}T${time}:00`);

  await repo.createVisit({
    userId: session.user.id,
    propertyId,
    scheduledAt,
    message: message || undefined,
  });

  redirect(`/properties/${propertySlug}?visited=1`);
}
