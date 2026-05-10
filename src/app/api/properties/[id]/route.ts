import { NextResponse } from "next/server";
import * as propertyService from "@/server/services/property.service";
import { updatePropertySchema } from "@/server/validations/property.schema";
import { ZodError } from "zod";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const property = await propertyService.getPropertyById(id);
    if (!property) {
      return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch (error) {
    console.error("[GET /api/properties/:id]", error);
    return NextResponse.json({ error: "Error al obtener la propiedad" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const input = updatePropertySchema.parse(body);
    const property = await propertyService.updateProperty(id, input);
    return NextResponse.json(property);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten().fieldErrors }, { status: 400 });
    }
    console.error("[PATCH /api/properties/:id]", error);
    return NextResponse.json({ error: "Error al actualizar la propiedad" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await propertyService.deleteProperty(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE /api/properties/:id]", error);
    return NextResponse.json({ error: "Error al eliminar la propiedad" }, { status: 500 });
  }
}
