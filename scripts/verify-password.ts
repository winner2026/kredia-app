import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function verifyPassword() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error("Uso: tsx scripts/verify-password.ts <email> <password>");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: {
      id: true,
      email: true,
      name: true,
      passwordHash: true,
      emailVerified: true,
    },
  });

  if (!user) {
    console.log("❌ Usuario no encontrado");
    process.exit(0);
  }

  console.log("\n📧 Usuario:", user.email);
  console.log("👤 Nombre:", user.name || "(sin nombre)");
  console.log("✅ Email verificado:", user.emailVerified ? "SÍ" : "NO");

  if (!user.passwordHash) {
    console.log("❌ El usuario no tiene contraseña configurada");
    process.exit(0);
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (isValid) {
    console.log("✅ CONTRASEÑA CORRECTA");
  } else {
    console.log("❌ CONTRASEÑA INCORRECTA");
  }

  console.log("\n");

  await prisma.$disconnect();
}

verifyPassword().catch(console.error);
