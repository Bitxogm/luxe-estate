import { prisma } from "@/lib/prisma";

export async function getReviewsByPropertyId(propertyId: string) {
  const reviews = await prisma.review.findMany({
    where: { propertyId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  return {
    reviews,
    averageRating,
  };
}
