import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ------------------- POST: Crear compra -------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("BODY RECIBIDO:", body);

    const {
      id,
      tarjeta,
      limite,
      fechaCorte,
      fechaCierre,
      nombreCompra,
      montoCuota,
      cantidadCuotas,
    } = body;

    // ⚠️ IMPORTANTE: usar SIEMPRE los nombres camelCase de Prisma
    const compra = await prisma.compra.create({
      data: {
        id,
        tarjeta,
        limite,
        fechaCorte: new Date(fechaCorte),
        fechaCierre: new Date(fechaCierre),
        nombreCompra,
        montoCuota,
        cantidadCuotas,
      },
    });

    return NextResponse.json({ ok: true, compra });
  } catch (error) {
    console.error("ERROR POST /api/compras:", error);
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }
}

// ------------------- GET: Listar compras -------------------
export async function GET() {
  try {
    const compras = await prisma.compra.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ok: true, compras });
  } catch (error) {
    console.error("ERROR GET /api/compras:", error);
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }
}
