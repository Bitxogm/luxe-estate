import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/properties/[id] - Obtiene una propiedad por ID
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
    });

    if (!property) {
      return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("[GET /api/properties/:id]", error);
    return NextResponse.json({ error: "Error al obtener la propiedad" }, { status: 500 });
  }
}

// PATCH /api/properties/[id] - Actualiza una propiedad
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();

    const property = await prisma.property.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error("[PATCH /api/properties/:id]", error);
    return NextResponse.json({ error: "Error al actualizar la propiedad" }, { status: 500 });
  }
}

// DELETE /api/properties/[id] - Elimina una propiedad
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.property.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE /api/properties/:id]", error);
    return NextResponse.json({ error: "Error al eliminar la propiedad" }, { status: 500 });
  }
}
