import { prisma } from "../lib/server/prisma";

async function checkUser() {
  const email = process.argv[2];

  if (!email) {
    console.error("Uso: tsx scripts/check-user.ts <email>");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
      passwordHash: true,
      verificationToken: true,
      createdAt: true,
    },
  });

  if (!user) {
    console.log("❌ Usuario no encontrado");
    process.exit(0);
  }

  console.log("\n✅ Usuario encontrado:");
  console.log("ID:", user.id);
  console.log("Email:", user.email);
  console.log("Nombre:", user.name || "(sin nombre)");
  console.log("Role:", user.role);
  console.log("Email verificado:", user.emailVerified ? "✅ SÍ" : "❌ NO");
  console.log("Fecha verificación:", user.emailVerified || "(no verificado)");
  console.log("Tiene password:", user.passwordHash ? "✅ SÍ" : "❌ NO");
  console.log("Token verificación pendiente:", user.verificationToken ? "⚠️ SÍ" : "✅ NO");
  console.log("Creado:", user.createdAt);
  console.log("\n");

  await prisma.$disconnect();
}

checkUser().catch(console.error);
