import { prisma } from "@/lib/server/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = "vmartinez071@gmail.com"; // ← cámbialo
  const newPassword = "Kredia2025#";

  const passwordHash = await bcrypt.hash(newPassword, 12);

  const user = await prisma.user.update({
    where: { email },
    data: { password: passwordHash },
  });

  console.log("Password actualizado:", user);
}

main().catch(console.error);
