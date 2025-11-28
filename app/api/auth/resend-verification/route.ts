import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { ensureRateLimit } from "@/lib/security/rateLimit";
import { getCurrentUser } from "@/lib/auth";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // Rate limit estricto
  const rate = await ensureRateLimit(req, { max: 3, windowMs: 60 * 60 * 1000 });
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Demasiados intentos. Intenta nuevamente en 1 hora." },
      { status: 429 }
    );
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    // Verificar si ya está verificado
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { emailVerified: true },
    });

    if (dbUser?.emailVerified) {
      return NextResponse.json(
        { error: "El email ya está verificado" },
        { status: 400 }
      );
    }

    // Generar nuevo token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenHash = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // Guardar token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: verificationTokenHash,
      },
    });

    // TODO: Enviar email de verificación
    // const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;
    // await sendVerificationEmail(user.email, verifyUrl);

    console.log(
      `Verification token for ${user.email}: ${verificationToken}`
    );
    console.log(`Verify URL would be: /verify-email?token=${verificationToken}`);

    return NextResponse.json({
      success: true,
      message: "Email de verificación enviado",
      // En desarrollo, retornar el token (ELIMINAR EN PRODUCCIÓN)
      ...(process.env.NODE_ENV === "development" && {
        token: verificationToken,
      }),
    });
  } catch (error) {
    console.error("Error in resend-verification:", error);
    return NextResponse.json(
      { error: "Error al procesar solicitud" },
      { status: 500 }
    );
  }
}
