import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/properties - Lista todas las propiedades
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const priceType = searchParams.get("priceType"); // "sale" | "rent"
    const type = searchParams.get("type"); // "House" | "Apartment" | "Villa" | "Penthouse"
    const city = searchParams.get("city");
    const featured = searchParams.get("featured"); // "true" | "false"
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "8");

    const where = {
      ...(priceType && { priceType }),
      ...(type && { type }),
      ...(city && { city: { contains: city, mode: "insensitive" as const } }),
      ...(featured === "true" && { isFeatured: true }),
    };

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({
      data: properties,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/properties]", error);
    return NextResponse.json({ error: "Error al obtener las propiedades" }, { status: 500 });
  }
}

// POST /api/properties - Crea una propiedad nueva
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const property = await prisma.property.create({
      data: body,
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("[POST /api/properties]", error);
    return NextResponse.json({ error: "Error al crear la propiedad" }, { status: 500 });
  }
}
