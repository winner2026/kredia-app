import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { ensureRateLimit } from "@/lib/security/rateLimit";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";

export const runtime = "nodejs";

const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Token requerido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(100, "La contraseña es demasiado larga"),
});

export async function POST(req: Request) {
  const rate = await ensureRateLimit(req, { max: 5, windowMs: 60 * 60 * 1000 });
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Demasiados intentos" },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = ResetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Datos inválidos" },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;

    // Hash del token para buscar en la base de datos
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Buscar usuario con token válido
    const user = await prisma.user.findFirst({
      where: {
        resetToken: resetTokenHash,
        resetTokenExpiry: {
          gt: new Date(), // Token no expirado
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 400 }
      );
    }

    // Hash de la nueva contraseña
    const passwordHash = await bcrypt.hash(password, 12);

    // Actualizar contraseña y limpiar token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Contraseña actualizada exitosamente",
    });
  } catch (error) {
    console.error("Error in reset-password:", error);
    return NextResponse.json(
      { error: "Error al procesar solicitud" },
      { status: 500 }
    );
  }
}
