import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { ensureRateLimit } from "@/lib/security/rateLimit";
import crypto from "crypto";
import { z } from "zod";

export const runtime = "nodejs";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

export async function POST(req: Request) {
  // Rate limit muy estricto para evitar abuso
  const rate = await ensureRateLimit(req, { max: 3, windowMs: 60 * 60 * 1000 });
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Demasiados intentos. Intenta nuevamente en 1 hora." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = ForgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Email inválido" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Por seguridad, siempre retornar éxito aunque el usuario no exista
    // Esto previene enumeration attacks
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Si el email existe, recibirás un enlace de recuperación.",
      });
    }

    // Generar token seguro
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Expiración en 1 hora
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    // Guardar token en la base de datos
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: resetTokenHash,
        resetTokenExpiry,
      },
    });

    // TODO: Enviar email con el enlace de reset
    // const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    // await sendPasswordResetEmail(user.email, resetUrl);

    console.log(`Password reset token for ${user.email}: ${resetToken}`);
    console.log(`Reset URL would be: /reset-password?token=${resetToken}`);

    return NextResponse.json({
      success: true,
      message: "Si el email existe, recibirás un enlace de recuperación.",
      // En desarrollo, retornar el token (ELIMINAR EN PRODUCCIÓN)
      ...(process.env.NODE_ENV === "development" && { token: resetToken }),
    });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    return NextResponse.json(
      { error: "Error al procesar solicitud" },
      { status: 500 }
    );
  }
}
