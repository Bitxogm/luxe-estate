"use server";

import { prisma } from "@/lib/prisma";

export async function getPropertiesWithRatingsAction(ids: string[]) {
  try {
    const ratings = await prisma.review.groupBy({
      by: ["propertyId"],
      where: {
        propertyId: { in: ids },
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    const ratingMap: Record<string, { average: number; count: number }> = {};

    // Initialize map
    ids.forEach((id) => {
      ratingMap[id] = { average: 0, count: 0 };
    });

    // Populate from group query
    ratings.forEach((group) => {
      ratingMap[group.propertyId] = {
        average: group._avg.rating ? parseFloat(group._avg.rating.toFixed(1)) : 0,
        count: group._count.rating,
      };
    });

    return { ratings: ratingMap };
  } catch (error) {
    console.error("Error in getPropertiesWithRatingsAction:", error);
    return { error: "Failed to fetch property reviews" };
  }
}
