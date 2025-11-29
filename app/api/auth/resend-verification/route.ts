import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { ensureRateLimit } from "@/lib/security/rateLimit";
import { getCurrentUser } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email/send";
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
      select: { emailVerified: true, name: true, email: true },
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

    const baseUrl =
      process.env.NEXTAUTH_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const verifyUrl = `${baseUrl}/verify-email?token=${verificationToken}`;
    const emailSent = await sendVerificationEmail(
      dbUser?.email ?? user.email!,
      verifyUrl,
      dbUser?.name ?? undefined
    );

    if (!emailSent) {
      // En desarrollo, permitimos continuar aunque falle el envío de email (simulado)
      if (process.env.NODE_ENV === "development") {
        console.warn("⚠️ Email de verificación no enviado (Development Mode). Continuando...");
      } else {
        return NextResponse.json(
          { success: false, error: "No se pudo enviar el email de verificacion. Revisa RESEND_API_KEY y EMAIL_FROM." },
          { status: 500 }
        );
      }
    }

    console.log(`Verification token for ${user.email}: ${verificationToken}`);
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
