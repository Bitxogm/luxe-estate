"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createNotificationAction } from "./notification.action";

export async function createReviewAction(propertyId: string, rating: number, comment: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  // Validate rating (between 1 and 5)
  if (typeof rating !== "number" || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return { error: "Rating must be an integer between 1 and 5." };
  }

  // Validate comment (min 10, max 500 characters)
  const trimmedComment = comment ? comment.trim() : "";
  if (trimmedComment.length < 10 || trimmedComment.length > 500) {
    return { error: "Comment must be between 10 and 500 characters." };
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { userId: true, slug: true, title: true },
  });

  if (!property) {
    return { error: "Property not found" };
  }

  if (property.userId === session.user.id) {
    return { error: "You cannot review your own property" };
  }

  const review = await prisma.review.upsert({
    where: {
      propertyId_userId: {
        propertyId,
        userId: session.user.id,
      },
    },
    update: {
      rating,
      comment: trimmedComment,
    },
    create: {
      propertyId,
      userId: session.user.id,
      rating,
      comment: trimmedComment,
    },
  });

  if (property.userId) {
    const userName = session.user.name || "A user";
    const propertyTitle = property.title;
    await createNotificationAction(
      property.userId,
      "review",
      "New review",
      `${userName} left a ${rating}★ review on ${propertyTitle}`,
      `/properties/${property.slug}`
    );
  }

  revalidatePath(`/properties/${property.slug}`);

  return { review };
}

export async function deleteReviewAction(reviewId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: { property: { select: { slug: true } } },
  });

  if (!review) {
    return { error: "Review not found" };
  }

  if (review.userId !== session.user.id && session.user.role !== "admin") {
    return { error: "Unauthorized to delete this review" };
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });

  revalidatePath(`/properties/${review.property.slug}`);

  return { success: true };
}
