import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import crypto from "crypto";
import { z } from "zod";

export const runtime = "nodejs";

const VerifyEmailSchema = z.object({
  token: z.string().min(1, "Token requerido"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = VerifyEmailSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Token inválido" },
        { status: 400 }
      );
    }

    const { token } = parsed.data;

    // Hash del token para buscar en la base de datos
    const verificationTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Buscar usuario con token válido
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: verificationTokenHash,
        emailVerified: null, // Solo si no está verificado
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Token inválido o email ya verificado" },
        { status: 400 }
      );
    }

    // Marcar email como verificado y limpiar token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email verificado exitosamente",
    });
  } catch (error) {
    console.error("Error in verify-email:", error);
    return NextResponse.json(
      { error: "Error al procesar solicitud" },
      { status: 500 }
    );
  }
}
