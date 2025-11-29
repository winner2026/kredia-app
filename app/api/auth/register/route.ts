import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { ensureRateLimit } from "@/lib/security/rateLimit";
import { sendVerificationEmail } from "@/lib/email/send";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";

export const runtime = "nodejs";

const RegisterSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  name: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    // Rate limiting: 5 registros por hora por IP
    const rate = await ensureRateLimit(req, { max: 5, windowMs: 60 * 60 * 1000 });
    if (!rate.ok) {
      return NextResponse.json(
        { success: false, error: "Demasiados intentos de registro. Intenta más tarde." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Datos inválidos" },
        { status: 400 }
      );
    }

    const { email, password, name } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Este email ya está registrado" },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 12);

    // Generar token de verificación de email
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenHash = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name?.trim() || null,
        passwordHash,
        role: "USER",
        verificationToken: verificationTokenHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // Construir URL de verificación
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const verifyUrl = `${baseUrl}/verify-email?token=${verificationToken}`;
    const emailSent = await sendVerificationEmail(user.email, verifyUrl, user.name ?? undefined);
    console.log("EMAIL VERIFICATION RESULT:", emailSent);

    if (!emailSent) {
      // En desarrollo, permitimos continuar aunque falle el envío de email (simulado)
      if (process.env.NODE_ENV === "development") {
        console.warn("⚠️ Email de verificación no enviado (Development Mode). Continuando registro...");
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
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      message: "Usuario registrado exitosamente. Revisa tu email para verificar tu cuenta.",
      // En desarrollo, retornar el token (ELIMINAR EN PRODUCCIÓN)
      ...(process.env.NODE_ENV === "development" && {
        verificationToken,
      }),
    });
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { success: false, error: "Error al crear usuario" },
      { status: 500 }
    );
  }
}
