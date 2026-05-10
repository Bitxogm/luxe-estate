import { NextResponse } from "next/server";
import * as propertyService from "@/server/services/property.service";
import { createPropertySchema } from "@/server/validations/property.schema";
import { ZodError } from "zod";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const result = await propertyService.getProperties({
      priceType: (searchParams.get("priceType") as "sale" | "rent") ?? undefined,
      type:
        (searchParams.get("type") as "House" | "Apartment" | "Villa" | "Penthouse") ?? undefined,
      city: searchParams.get("city") ?? undefined,
      featured: searchParams.get("featured") === "true" ? true : undefined,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten().fieldErrors }, { status: 400 });
    }
    console.error("[GET /api/properties]", error);
    return NextResponse.json({ error: "Error al obtener las propiedades" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = createPropertySchema.parse(body);
    const property = await propertyService.createProperty(input);
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten().fieldErrors }, { status: 400 });
    }
    console.error("[POST /api/properties]", error);
    return NextResponse.json({ error: "Error al crear la propiedad" }, { status: 500 });
  }
}
